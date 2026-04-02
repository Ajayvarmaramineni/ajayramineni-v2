export type Project = {
  id: string;
  title: string;
  category: string;
  stack: string[];
  description: string;
  /** Short outcome line used in PortfolioClient cards */
  outcome: string;
  /** Longer bullet highlights used in FeaturedWork cards */
  highlights: string[];
  /** Gradient classes for FeaturedWork banner */
  gradient: string;
  /** Accent hex colour for FeaturedWork cards */
  accentColor: string;
  github: string | null;
  live: string | null;
};

export const projects: Project[] = [
  {
    id: "01",
    title: "Azure ML Income Prediction",
    category: "Machine Learning",
    gradient: "from-[#1e1b4b] via-[#312e81] to-[#0f172a]",
    accentColor: "#FD9346",
    stack: ["Python", "Azure ML Studio", "Boosted Decision Trees", "Feature Engineering"],
    description:
      "End-to-end ML pipeline for income prediction using boosted decision trees on Azure ML Studio. Includes data preprocessing, feature engineering, hyperparameter tuning, and model deployment. Achieved strong AUC-ROC on the Adult UCI dataset.",
    outcome: "Deployed model on Azure · AUC-ROC optimized",
    highlights: [
      "Built full pipeline from raw data to deployed model on Azure ML Studio",
      "Applied feature engineering, cross-validation & hyperparameter tuning",
      "Achieved optimised AUC-ROC using ensemble boosted decision trees",
    ],
    github: "https://github.com/Ajayvarmaramineni/azure-ml-income-prediction",
    live: null,
  },
  {
    id: "02",
    title: "Nike Business Intelligence Dashboard",
    category: "Business Intelligence",
    gradient: "from-[#1c0a00] via-[#431407] to-[#0f172a]",
    accentColor: "#fb923c",
    stack: ["Power BI", "SQL", "DAX", "Excel"],
    description:
      "Analyzed 3 interconnected datasets (99k+ records total) to surface regional sales KPIs, retailer performance, and product trends. Built interactive Power BI dashboards with drill-down capabilities. Proposed a unified data warehouse strategy for cross-team alignment.",
    outcome: "99k+ records analyzed · Regional KPIs surfaced",
    highlights: [
      "Processed 99K+ records across 3 datasets to surface actionable KPIs",
      "Built interactive Power BI dashboards with regional drill-down",
      "Proposed unified data warehouse strategy for cross-team alignment",
    ],
    github: null,
    live: null,
  },
  {
    id: "03",
    title: "Anime Recommendation System",
    category: "Machine Learning",
    gradient: "from-[#0d1a2e] via-[#0f3460] to-[#0a0a1a]",
    accentColor: "#22d3ee",
    stack: ["Python", "Pandas", "TF-IDF", "Cosine Similarity", "Scikit-Learn"],
    description:
      "Content-based recommendation engine built on 12,000+ anime titles. Uses TF-IDF vectorization on genre, type, and studio metadata, with cosine similarity for personalized recommendations. Includes popularity weighting and cold-start handling.",
    outcome: "12k+ titles · Real-time recommendations",
    highlights: [
      "Vectorised metadata across 12,000+ titles with TF-IDF",
      "Personalises suggestions by genre, type, and rating signals",
      "Includes popularity weighting for cold-start handling",
    ],
    github: null,
    live: null,
  },
  {
    id: "04",
    title: "Titanic Kaggle Competition",
    category: "Machine Learning",
    gradient: "from-[#0f1f1a] via-[#064e3b] to-[#0f172a]",
    accentColor: "#34d399",
    stack: ["Python", "Pandas", "Scikit-Learn", "Random Forest", "XGBoost"],
    description:
      "Kaggle survival prediction competition. Applied feature engineering (title extraction, family size, cabin deck), ensemble methods combining Random Forest and XGBoost, and k-fold cross-validation. Final submission achieved 0.78708 accuracy (Top 35%).",
    outcome: "0.78708 score · Top 35% globally",
    highlights: [
      "Feature engineering: title extraction, family size, cabin deck",
      "Ensemble of Random Forest + XGBoost with k-fold cross-validation",
      "Ranked Top 35% globally with 0.78708 test accuracy",
    ],
    github: "https://github.com/Ajayvarmaramineni/titanic-kaggle",
    live: null,
  },
  {
    id: "05",
    title: "CollegeROI Digital Strategy",
    category: "Web",
    gradient: "from-[#0f172a] via-[#1e3a5f] to-[#0a0a1a]",
    accentColor: "#60a5fa",
    stack: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    description:
      "Full-funnel digital marketing strategy and responsive website for a US EdTech startup. Designed user journeys, conversion funnels, and SEO strategy. Built mobile-first, accessible website with performance-optimized assets.",
    outcome: "Full funnel strategy · Mobile-first delivery",
    highlights: [
      "Designed end-to-end user journeys and conversion funnels",
      "Built mobile-first, accessible website with optimised assets",
      "Delivered full SEO strategy for the EdTech niche",
    ],
    github: null,
    live: null,
  },
  {
    id: "06",
    title: "Business Dev at Visatree",
    category: "Strategy",
    gradient: "from-[#1a0a2e] via-[#2d1b69] to-[#0f172a]",
    accentColor: "#a78bfa",
    stack: ["CRM", "Sales Strategy", "Team Leadership", "Analytics"],
    description:
      "Led a team of 8 business development executives. Built and managed a 200+ lead pipeline, achieving 75% conversion rate through data-driven prioritization and personalized outreach strategies. Secured 30+ institutional partnerships across India.",
    outcome: "75% conversion · 30+ partnerships",
    highlights: [
      "Led a team of 8 BDEs and managed 200+ lead pipeline",
      "Achieved 75% conversion through data-driven outreach",
      "Secured 30+ institutional partnerships across India",
    ],
    github: null,
    live: null,
  },
];

/** First 4 projects used on the home page FeaturedWork section */
export const featuredProjects = projects.slice(0, 4);
