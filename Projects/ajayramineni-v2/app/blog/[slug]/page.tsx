import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

// Static post data — replace with MDX file system reads later
const posts: Record<string, { title: string; date: string; readTime: string; tag: string; content: string; image?: string; imageAlt?: string }> = {
  "whats-the-purpose": {
    title: "What's the Purpose?",
    date: "April 2025",
    readTime: "4 min",
    tag: "Nights",
    image: "/images/purpose-sunset.jpg",
    imageAlt: "A silhouette standing on a hilltop watching the sunset over a valley",
    content: `
# What's the Purpose?

Me? I am a free man. Free to choose my own thoughts, free to work, free to go on a trek, free to travel around the world or lie in bed all day doing nothing but eating pizza without anyone telling me how.

But that's the free part. The man part's a little different.

When I was growing up, I used to think that the whole point is to arrive somewhere — earn money, live a comfortable life. Like there'd be a point where things made sense. Thinking that adults had it figured out, their world is ordered, rational, and purposeful.

And when I got there. It doesn't.

The world isn't broken, it was never assembled in the first place. The order I saw as a kid — I was just too small to see the cracks.

Here's what no one told me, and maybe that's good news.

Because once I stop waiting for things to be fixed, I get to start living in what it actually is. I learned to move through the mess without needing it to resolve. And people might call it cynicism, but it's not. That's the closest thing to real freedom I've found.

Like Albert Camus says: "In the midst of winter, I found there was within me an invincible summer." Freedom found inside the mess, not outside of it.

The reason I penned this down for you to read is not to quote something on existentialism, not to teach you how to live — it's just this thought lingering in my head about what's the purpose of all this. At its simplest, maybe life is about three things: on a universal level, it's just about existing. On a human level, it's about raising the next generation to keep our story going. And on a social level, it's about the daily choice to simply be a good person. But even after all of that, something doesn't seem to fit. And maybe I will never know.

And I think that's okay.

Not in a defeated way. Not in the way you shrug your shoulders and walk away from something too heavy to carry. More like, I've started to make peace with the open end of the question. Because every time I've chased an answer all the way to its root, I find another door. Another "but why." It never really stops.

Maybe the purpose isn't a destination that you arrive at. Maybe it's something you build, badly, and rebuild again. Like a sentence you keep editing and never quite publish — just like this blog I'm writing. Or maybe, and this is the thought I keep coming back to — the discomfort of not knowing is the purpose. That restlessness, that itch. It's what kept me awake, kept me moving, kept me human.

I don't have an answer for you. I barely have one for myself. But I think that's the most honest thing I can offer.

What I'm really trying to say this whole time is not that life is meaningless, but that meaning was never pre-packaged. No instruction manual, no written fate, no arrival point — and definitely not a moment where it all clicks and stays clicked. It's just you, whatever you choose, and the discomfort of not having the answers.

I am still figuring it out. Some days feel like clarity, most days feel like tired. But here I am, writing this at an hour I probably shouldn't be awake, and that feels like something. Maybe that's enough for now.

with love, Aj
    `,
  },
  "ml-pipeline-best-practices": {
    title: "Building Production-Ready ML Pipelines on Azure",
    date: "March 2025",
    readTime: "6 min",
    tag: "Machine Learning",
    content: `
# Building Production-Ready ML Pipelines on Azure

After completing my Azure ML income prediction project, I compiled the key lessons I learned about building ML pipelines that actually hold up in production...

## Why Most ML Projects Fail in Production

The gap between a Jupyter notebook and a deployed, monitored model is enormous. Most data science tutorials stop at model training accuracy. Production ML is a different beast.

## The Pipeline Architecture

A robust Azure ML pipeline has five core stages:

**1. Data Ingestion & Validation** — Use Azure Data Factory or SDK v2 datasets with explicit schema validation. Fail fast if the data doesn't match expectations.

**2. Feature Engineering** — Build transformations as reusable pipeline components, not one-off scripts. This is what lets you reproduce results and update features cleanly.

**3. Model Training** — Use Azure ML experiments for automatic tracking. Log hyperparameters, metrics, and artifacts on every run — not just the winning one.

**4. Evaluation & Promotion** — Compare against a baseline. Never promote a model without a side-by-side comparison on a held-out test set.

**5. Deployment & Monitoring** — Use managed online endpoints for real-time inference. Set up data drift monitors from day one — they'll save you from silent model degradation.

## Key Lessons

- **Version everything** — data, code, and models. Azure ML makes this easy with registered datasets and model registry.
- **Build for retraining** — pipelines should be triggerable, not just run-once scripts.
- **Monitor distribution shift** — the world changes; your model needs to know when it does.

The income prediction project taught me that the boring infrastructure work is what separates reliable ML from demo ML.
    `,
  },
  "power-bi-kpi-dashboard": {
    title: "Designing KPI Dashboards That Actually Get Used",
    date: "February 2025",
    readTime: "5 min",
    tag: "Business Intelligence",
    content: `
# Designing KPI Dashboards That Actually Get Used

The Nike BI project was my first time working with a dataset at real scale — 99k+ records across three interconnected tables. Here's what I learned about dashboard design that doesn't just look good, but actually changes decisions.

## The Problem With Most Dashboards

Most dashboards are built for the analyst who made them. They have every metric the analyst found interesting, arranged in a grid that makes technical sense. Then nobody uses them.

## Start With the Decision, Not the Data

Before I opened Power BI, I asked: what decision is this dashboard supposed to support? For Nike, it was regional resource allocation — where to invest in retailer support and marketing spend.

That single question eliminated 60% of the metrics I initially wanted to include.

## The Layout Principles I Use

**Top-left is the most valuable real estate** — put your primary KPI there. Everything else supports it.

**Use visual hierarchy** — large numbers for KPIs, small charts for trends, tables for drill-down. Don't make users hunt for the insight.

**Color is communication** — use one accent color for the metric you want users to act on. Reserve red for genuinely alarming values.

## What Made the Nike Dashboard Work

We surfaced regional performance gaps that weren't visible in the raw data. By normalizing sales by store count rather than absolute revenue, it became clear which regions were over-indexed on large format stores and which were under-served.

That finding directly influenced the strategic recommendation.
    `,
  },
  "data-strategy-for-startups": {
    title: "Why Most Startups Get Their Data Strategy Wrong",
    date: "January 2025",
    readTime: "7 min",
    tag: "Strategy",
    content: `
# Why Most Startups Get Their Data Strategy Wrong

Coming from a business development background before pivoting into data analytics, I've seen data strategy from both sides. Here's what I see early-stage founders consistently getting wrong.

## Mistake 1: Buying Tools Before Defining Questions

The most common mistake is tool-first thinking. A startup buys a BI tool, Snowflake, and a CDP before they've defined the three questions they're trying to answer this quarter.

Start with the question. The tool is always secondary.

## Mistake 2: Storing Everything, Analyzing Nothing

Storage is cheap. But a data warehouse full of unstructured event logs with no documentation is worse than useless — it creates false confidence that you're "data-driven" while making actual analysis nearly impossible.

## Mistake 3: Not Assigning Data Ownership

Data quality degrades without owners. Every key metric should have a single person who is responsible for its definition and accuracy. When a number looks wrong, there should be one person to call.

## What Good Early-Stage Data Strategy Looks Like

- Three to five key metrics that directly map to business goals
- One source of truth for each metric, clearly documented
- A lightweight reporting cadence (weekly, not real-time for most things)
- Clean event tracking on your core user flows from day one

You don't need a data warehouse at Seed stage. You need honest numbers and the discipline to look at them weekly.
    `,
  },
  "tfidf-recommendation-systems": {
    title: "TF-IDF for Recommendation Systems: A Practical Guide",
    date: "December 2024",
    readTime: "8 min",
    tag: "Machine Learning",
    content: `
# TF-IDF for Recommendation Systems: A Practical Guide

For my anime recommendation system, I chose TF-IDF + cosine similarity over collaborative filtering deliberately. Here's why, and how to implement it.

## Why Content-Based Over Collaborative?

Collaborative filtering requires user interaction data — ratings, views, clicks. My dataset had rich item metadata but limited user behavior data. TF-IDF is ideal when your items have descriptive text and you don't have a large user interaction matrix.

## The TF-IDF Approach

TF-IDF (Term Frequency-Inverse Document Frequency) converts text into a numerical matrix where each entry represents how distinctive a word is for a given document.

For recommendations, each "document" is an item profile — genre, description, studio, type. The key insight is that common words like "action" are less informative than specific ones like "mecha" or "psychological".

## Implementation Steps

\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

# Build item profiles
df['profile'] = df['genre'] + ' ' + df['type'] + ' ' + df['studio']

# TF-IDF matrix
tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
tfidf_matrix = tfidf.fit_transform(df['profile'])

# Similarity matrix
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

def recommend(title, n=10):
    idx = df[df['name'] == title].index[0]
    sim_scores = sorted(enumerate(cosine_sim[idx]), key=lambda x: x[1], reverse=True)[1:n+1]
    return df.iloc[[i[0] for i in sim_scores]][['name', 'genre', 'rating']]
\`\`\`

## Results

On the 12k+ title dataset, the recommendations were highly relevant within genre clusters. Adding popularity weighting (upranking highly-rated titles with 1000+ reviews) significantly improved perceived recommendation quality.
    `,
  },
};

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = posts[params.slug];
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.content.slice(0, 160).replace(/[#\n]/g, " ").trim(),
  };
}

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export default function BlogPostPage({ params }: Props) {
  const post = posts[params.slug];
  if (!post) notFound();
  return <BlogPostClient post={post} />;
}
