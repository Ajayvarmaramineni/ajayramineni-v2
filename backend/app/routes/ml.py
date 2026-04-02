from __future__ import annotations
"""
routes/ml.py — POST /ml/{file_id}
AutoML: tries multiple models, picks the best via cross-validation,
then evaluates the winner on a held-out test set.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np

from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression, Ridge
from sklearn.svm import SVC, SVR
from sklearn.model_selection import train_test_split, cross_val_score, learning_curve
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score, r2_score, confusion_matrix,
    f1_score, precision_score, recall_score, roc_auc_score,
    mean_absolute_error, mean_squared_error,
    roc_curve,
)
from sklearn.calibration import calibration_curve

from app.services.file_service import FILE_STORE

router = APIRouter()


class MLRequest(BaseModel):
    target_column: str


# ── Model catalogues ─────────────────────────────────────────────────────────

def _clf_candidates(n_rows: int) -> list[tuple[str, object]]:
    """Return (name, estimator) pairs for classification."""
    candidates = [
        ("Logistic Regression", Pipeline([
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(max_iter=1000, random_state=42)),
        ])),
        ("Random Forest", RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)),
        ("Gradient Boosting", GradientBoostingClassifier(n_estimators=100, random_state=42)),
    ]
    # SVM gets slow on large datasets — skip if > 5 000 rows
    if n_rows <= 5_000:
        candidates.append((
            "SVM",
            Pipeline([
                ("scaler", StandardScaler()),
                ("clf", SVC(probability=True, random_state=42)),
            ])
        ))
    return candidates


def _reg_candidates(n_rows: int) -> list[tuple[str, object]]:
    """Return (name, estimator) pairs for regression."""
    candidates = [
        ("Linear Regression", Pipeline([
            ("scaler", StandardScaler()),
            ("reg", LinearRegression()),
        ])),
        ("Ridge Regression", Pipeline([
            ("scaler", StandardScaler()),
            ("reg", Ridge(random_state=42)),
        ])),
        ("Random Forest", RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)),
        ("Gradient Boosting", GradientBoostingRegressor(n_estimators=100, random_state=42)),
    ]
    if n_rows <= 5_000:
        candidates.append((
            "SVR",
            Pipeline([
                ("scaler", StandardScaler()),
                ("reg", SVR()),
            ])
        ))
    return candidates


# ── Route ────────────────────────────────────────────────────────────────────

@router.post("/{file_id}")
async def run_ml(file_id: str, body: MLRequest):
    record = FILE_STORE.get(file_id)
    if not record:
        raise HTTPException(status_code=404, detail="Session expired — please re-upload your file.")

    df: pd.DataFrame = record["df"].copy()
    target = body.target_column

    if target not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{target}' not found in dataset.")

    # Drop rows where target is null
    df = df.dropna(subset=[target])
    if len(df) < 10:
        raise HTTPException(status_code=400, detail="Not enough data rows to run predictions (need at least 10).")

    # Detect task type
    n_unique = df[target].nunique()
    task_type = "classification" if n_unique <= 15 else "regression"

    # Separate features and target
    X = df.drop(columns=[target])
    y = df[target]

    # Encode target for classification
    target_labels: list[str] = []
    if task_type == "classification":
        le = LabelEncoder()
        y = le.fit_transform(y.astype(str))
        target_labels = [str(c) for c in le.classes_]

    # Encode feature columns
    X = _encode_features(X)

    # Train / test split (stratify for classification if possible)
    try:
        split_kwargs: dict = {"test_size": 0.2, "random_state": 42}
        if task_type == "classification":
            split_kwargs["stratify"] = y
        X_train, X_test, y_train, y_test = train_test_split(X, y, **split_kwargs)
    except Exception:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # ── Cross-validate all candidates ────────────────────────────────────────
    n_rows = len(X_train)
    cv_folds = 3 if n_rows < 500 else 5
    scoring = "accuracy" if task_type == "classification" else "r2"

    candidates = _clf_candidates(n_rows) if task_type == "classification" else _reg_candidates(n_rows)
    model_comparison: list[dict] = []
    best_name, best_model, best_cv = "", None, -999.0

    for name, estimator in candidates:
        try:
            scores = cross_val_score(estimator, X_train, y_train, cv=cv_folds, scoring=scoring, n_jobs=-1)
            cv_mean = float(scores.mean())
            cv_std  = float(scores.std())
        except Exception:
            cv_mean, cv_std = 0.0, 0.0

        model_comparison.append({
            "model":   name,
            "cv_score": round(cv_mean * 100, 1),
            "cv_std":   round(cv_std  * 100, 1),
            "winner":   False,
        })
        if cv_mean > best_cv:
            best_cv    = cv_mean
            best_name  = name
            best_model = estimator

    # Mark winner
    for row in model_comparison:
        if row["model"] == best_name:
            row["winner"] = True

    # ── Retrain winner on full train set ─────────────────────────────────────
    try:
        best_model.fit(X_train, y_train)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Model training failed: {str(e)}")

    y_pred = best_model.predict(X_test)
    extra_metrics: dict = {}
    roc_curve_data: dict | None = None
    calibration_data: dict | None = None

    if task_type == "classification":
        score        = round(float(accuracy_score(y_test, y_pred)) * 100, 1)
        metric_label = "Accuracy"
        cm           = confusion_matrix(y_test, y_pred).tolist()

        avg = "binary" if len(target_labels) == 2 else "macro"
        extra_metrics["f1"]        = round(float(f1_score(y_test, y_pred, average=avg, zero_division=0)) * 100, 1)
        extra_metrics["precision"] = round(float(precision_score(y_test, y_pred, average=avg, zero_division=0)) * 100, 1)
        extra_metrics["recall"]    = round(float(recall_score(y_test, y_pred, average=avg, zero_division=0)) * 100, 1)

        try:
            if hasattr(best_model, "predict_proba"):
                if len(target_labels) == 2:
                    y_prob = best_model.predict_proba(X_test)[:, 1]
                    extra_metrics["auc"] = round(float(roc_auc_score(y_test, y_prob)) * 100, 1)

                    # ── ROC curve ────────────────────────────────────────────
                    try:
                        fpr, tpr, _ = roc_curve(y_test, y_prob)
                        # Downsample to at most 100 points for payload efficiency
                        step = max(1, len(fpr) // 100)
                        roc_curve_data = {
                            "fpr": [round(float(v), 4) for v in fpr[::step]],
                            "tpr": [round(float(v), 4) for v in tpr[::step]],
                        }
                    except Exception:
                        roc_curve_data = None

                    # ── Calibration curve ────────────────────────────────────
                    try:
                        frac_pos, mean_pred = calibration_curve(
                            y_test, y_prob, n_bins=10, strategy="uniform"
                        )
                        calibration_data = {
                            "mean_predicted":       [round(float(v), 4) for v in mean_pred],
                            "fraction_of_positives": [round(float(v), 4) for v in frac_pos],
                        }
                    except Exception:
                        calibration_data = None
                else:
                    y_prob = best_model.predict_proba(X_test)
                    extra_metrics["auc"] = round(
                        float(roc_auc_score(y_test, y_prob, multi_class="ovr", average="macro")) * 100, 1
                    )
            else:
                extra_metrics["auc"] = None
        except Exception:
            extra_metrics["auc"] = None
    else:
        score        = round(float(r2_score(y_test, y_pred)) * 100, 1)
        metric_label = "R² Score"
        cm           = []

        extra_metrics["mae"]  = round(float(mean_absolute_error(y_test, y_pred)), 4)
        extra_metrics["rmse"] = round(float(mean_squared_error(y_test, y_pred) ** 0.5), 4)

    # ── Feature importances (tree models only) ───────────────────────────────
    fi = _get_feature_importances(best_model, list(X.columns))

    # ── SHAP values (tree models only) ───────────────────────────────────────
    shap_values_data: list[dict] = []
    try:
        import shap  # optional dependency
        est = best_model.steps[-1][1] if hasattr(best_model, "steps") else best_model
        if hasattr(est, "feature_importances_"):
            # TreeExplainer is fast; limit to 100 test samples
            sample = X_test.iloc[:100]
            explainer = shap.TreeExplainer(est)
            sv = explainer.shap_values(sample)
            # For multi-class classifiers shap_values returns a list (one per class)
            if isinstance(sv, list):
                sv = np.array(sv).mean(axis=0)
            mean_abs_shap = np.abs(sv).mean(axis=0)
            shap_values_data = sorted(
                [
                    {"feature": f, "shap_value": round(float(v), 4)}
                    for f, v in zip(X.columns, mean_abs_shap)
                ],
                key=lambda x: abs(x["shap_value"]),
                reverse=True,
            )[:15]
    except Exception:
        shap_values_data = []

    # ── Learning curves ───────────────────────────────────────────────────────
    learning_curve_data: dict | None = None
    try:
        # Re-instantiate a clone of the best model to avoid state issues
        from sklearn.base import clone as sklearn_clone
        lc_model = sklearn_clone(best_model)
        n_splits = min(3, max(2, len(X_train) // 50))
        lc_sizes = np.linspace(0.2, 1.0, 5)
        train_sizes_abs, lc_train_scores, lc_val_scores = learning_curve(
            lc_model, X_train, y_train,
            cv=n_splits, scoring=scoring,
            train_sizes=lc_sizes, n_jobs=-1,
        )
        learning_curve_data = {
            "train_sizes":  [int(v) for v in train_sizes_abs],
            "train_scores": [round(float(v.mean()) * 100, 1) for v in lc_train_scores],
            "val_scores":   [round(float(v.mean()) * 100, 1) for v in lc_val_scores],
        }
    except Exception:
        learning_curve_data = None

    return {
        "task_type":      task_type,
        "target_column":  target,
        "metric_label":   metric_label,
        "score":          score,
        "best_model":     best_name,
        "train_rows":     len(X_train),
        "test_rows":      len(X_test),
        "n_features":     len(X.columns),
        "feature_importances": fi,
        "confusion_matrix":    cm,
        "target_labels":       target_labels,
        "model_comparison":    model_comparison,
        "roc_curve":           roc_curve_data,
        "calibration_curve":   calibration_data,
        "learning_curve":      learning_curve_data,
        "shap_values":         shap_values_data,
        **extra_metrics,
    }


# ── Helpers ──────────────────────────────────────────────────────────────────

def _encode_features(X: pd.DataFrame) -> pd.DataFrame:
    """Encode all non-numeric columns with LabelEncoder, drop unparseable ones."""
    X = X.copy()
    cols_to_drop = []
    for col in X.columns:
        if X[col].dtype == object or str(X[col].dtype) == "category":
            try:
                le = LabelEncoder()
                X[col] = le.fit_transform(X[col].astype(str).fillna("missing"))
            except Exception:
                cols_to_drop.append(col)
        elif not pd.api.types.is_numeric_dtype(X[col]):
            cols_to_drop.append(col)
        else:
            X[col] = X[col].fillna(X[col].median())
    if cols_to_drop:
        X = X.drop(columns=cols_to_drop)
    return X


def _get_feature_importances(model, feature_names: list[str]) -> list[dict]:
    """Extract feature importances from tree-based models; return [] for others."""
    # Unwrap Pipeline if needed
    est = model
    if hasattr(model, "steps"):
        est = model.steps[-1][1]

    if not hasattr(est, "feature_importances_"):
        return []

    importances = est.feature_importances_
    fi = sorted(
        [{"feature": name, "importance": round(float(imp) * 100, 2)}
         for name, imp in zip(feature_names, importances)],
        key=lambda x: x["importance"],
        reverse=True,
    )[:15]
    return fi
