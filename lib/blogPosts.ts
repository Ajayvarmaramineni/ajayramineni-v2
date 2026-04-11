export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  category: "article" | "nights" | "dear-stranger";
  featured: boolean;
  content: string;
};

export const blogPosts: BlogPost[] = [

  // ── ARTICLES ──────────────────────────────────────────────────────────────

  {
    slug: "ml-pipeline-best-practices",
    title: "Building Production-Ready ML Pipelines on Azure",
    excerpt:
      "From raw data to deployed model. A hands-on guide to Azure ML Studio pipelines with boosted decision trees, feature stores, and monitoring.",
    date: "March 2025",
    readTime: "6 min",
    tag: "Machine Learning",
    category: "article",
    featured: true,
    content: `
# Building Production-Ready ML Pipelines on Azure

After completing my Azure ML income prediction project, I compiled the key lessons I learned about building ML pipelines that actually hold up in production.

## Why Most ML Projects Fail in Production

The gap between a Jupyter notebook and a deployed, monitored model is enormous. Most data science tutorials stop at model training accuracy. Production ML is a different beast.

## The Pipeline Architecture

A robust Azure ML pipeline has five core stages:

**1. Data Ingestion and Validation**
Use Azure Data Factory or SDK v2 datasets with explicit schema validation. Fail fast if the data does not match expectations.

**2. Feature Engineering**
Build transformations as reusable pipeline components, not one-off scripts. This is what lets you reproduce results and update features cleanly.

**3. Model Training**
Use Azure ML experiments for automatic tracking. Log hyperparameters, metrics, and artifacts on every run, not just the winning one.

**4. Evaluation and Promotion**
Compare against a baseline. Never promote a model without a side-by-side comparison on a held-out test set.

**5. Deployment and Monitoring**
Use managed online endpoints for real-time inference. Set up data drift monitors from day one.

## Key Lessons

- Version everything: data, code, and models. Azure ML makes this easy with registered datasets and model registry.
- Build for retraining: pipelines should be triggerable, not just run-once scripts.
- Monitor distribution shift: the world changes; your model needs to know when it does.
    `,
  },

  {
    slug: "power-bi-kpi-dashboard",
    title: "Designing KPI Dashboards That Actually Get Used",
    excerpt:
      "The gap between a technically correct dashboard and one that drives decisions. Lessons from the Nike BI project on layout, storytelling, and stakeholder buy-in.",
    date: "February 2025",
    readTime: "5 min",
    tag: "Business Intelligence",
    category: "article",
    featured: true,
    content: `
# Designing KPI Dashboards That Actually Get Used

The Nike BI project was my first time working with a dataset at real scale, 99K+ records across three interconnected tables. Here is what I learned about dashboard design that actually changes decisions.

## The Problem With Most Dashboards

Most dashboards are built for the analyst who made them. They have every metric the analyst found interesting, arranged in a grid that makes technical sense. Then nobody uses them.

## Start With the Decision, Not the Data

Before I opened Power BI, I asked: what decision is this dashboard supposed to support? For Nike, it was regional resource allocation. That single question eliminated 60% of the metrics I initially wanted to include.

## The Layout Principles I Use

**Top-left is the most valuable real estate**
Put your primary KPI there. Everything else supports it.

**Use visual hierarchy**
Large numbers for KPIs, small charts for trends, tables for drill-down.

**Color is communication**
Use one accent color for the metric you want users to act on.

## What Made the Nike Dashboard Work

We surfaced regional performance gaps that were not visible in the raw data. By normalizing sales by store count rather than absolute revenue, it became clear which regions were over-indexed on large format stores.
    `,
  },

  {
    slug: "data-strategy-for-startups",
    title: "Why Most Startups Get Their Data Strategy Wrong",
    excerpt:
      "Common mistakes I see in early-stage companies and how to build a scalable data foundation from day one to Series A.",
    date: "January 2025",
    readTime: "7 min",
    tag: "Strategy",
    category: "article",
    featured: false,
    content: `
# Why Most Startups Get Their Data Strategy Wrong

Coming from a business development background before pivoting into data analytics, I have seen data strategy from both sides.

## Mistake 1: Buying Tools Before Defining Questions

The most common mistake is tool-first thinking. A startup buys a BI tool, Snowflake, and a CDP before they have defined the three questions they are trying to answer this quarter.

## Mistake 2: Storing Everything, Analyzing Nothing

Storage is cheap. But a data warehouse full of unstructured event logs with no documentation is worse than useless.

## Mistake 3: Not Assigning Data Ownership

Data quality degrades without owners. Every key metric should have a single person responsible for its definition and accuracy.

## What Good Early-Stage Data Strategy Looks Like

- Three to five key metrics that directly map to business goals
- One source of truth for each metric, clearly documented
- A lightweight reporting cadence
- Clean event tracking on your core user flows from day one
    `,
  },

  {
    slug: "tfidf-recommendation-systems",
    title: "TF-IDF for Recommendation Systems: A Practical Guide",
    excerpt:
      "How I used TF-IDF and cosine similarity to build a content-based anime recommendation engine on 12K+ titles. Code included.",
    date: "December 2024",
    readTime: "8 min",
    tag: "Machine Learning",
    category: "article",
    featured: false,
    content: `
# TF-IDF for Recommendation Systems: A Practical Guide

For my anime recommendation system, I chose TF-IDF plus cosine similarity over collaborative filtering deliberately.

## Why Content-Based Over Collaborative?

Collaborative filtering requires user interaction data. My dataset had rich item metadata but limited user behavior data. TF-IDF is ideal when your items have descriptive text.

## The TF-IDF Approach

TF-IDF converts text into a numerical matrix where each entry represents how distinctive a word is for a given document. For recommendations, each document is an item profile.

## Implementation

\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

df['profile'] = df['genre'] + ' ' + df['type'] + ' ' + df['studio']

tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
tfidf_matrix = tfidf.fit_transform(df['profile'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

def recommend(title, n=10):
    idx = df[df['name'] == title].index[0]
    sim_scores = sorted(enumerate(cosine_sim[idx]), key=lambda x: x[1], reverse=True)[1:n+1]
    return df.iloc[[i[0] for i in sim_scores]][['name', 'genre', 'rating']]
\`\`\`

## Results

On the 12K+ title dataset, recommendations were highly relevant within genre clusters. Adding popularity weighting significantly improved perceived quality.
    `,
  },

  // ── NIGHTS SERIES ─────────────────────────────────────────────────────────

  {
    slug: "the-night-i-felt-lost",
    title: "The Night I Felt Lost",
    excerpt: "On wandering after dark, questioning every choice, and finding a strange kind of peace inside the storm.",
    date: "June 15, 2025",
    readTime: "5 min",
    tag: "Nights",
    category: "nights",
    featured: false,
    content: `
# The Night I Felt Lost

The stars were out, but they offered no guidance. It was one of those nights where the world felt too big, and I felt impossibly small, adrift in a sea of my thoughts. The air was cool, heavy with the scent of earth, and the streets were eerily quiet except for the occasional sound of cars passing by. I wandered, my sneakers scuffing against the road, each step a question I couldn't answer.

I don't know exactly when the feeling started. Maybe it was earlier that day when a conversation with a friend left me questioning my choices. Or maybe it was the weight of a decision I'd been avoiding, pressing harder against my chest. But by nightfall, it was undeniable: I was lost. My purpose, my direction, my sense of self felt like shadows slipping through my fingers.

> Being lost is not the end; it's the beginning of finding a new path. — Unknown

I passed by the street park and found a bench near an oak tree that's probably seen more heartbreaks than I'll ever know. I wondered if anyone else had ever felt this way, like they were standing at a crossroads with no signs to guide them. I thought about calling someone, but what would I say? "I'm lost, but I don't know why"? It sounded ridiculous even in my head.

It felt like I was questioning every choice I'd made so far, every decision that brought me here. Saying "I have no regrets" would be a lie, but I've always tried to take responsibility for the paths I chose, whether they brought comfort or chaos. Moving to the USA was one of the biggest decisions of my life. At first, I believed it was just a new beginning for the same version of me. But I was wrong. It wasn't a continuation, it was a complete restart. Everything I thought I knew didn't quite fit anymore. I had to unlearn and start over, learning the new place, the new culture, the silences between conversations.

> I didn't cross oceans and burn bridges behind me just to turn around. I may be lost right now, but I know I'm not broken.

Some nights, it all plays out in front of me in 4K. Vivid, loud, and unskippable. And in those moments, I can't help but wonder if I made a mistake. Leaving my job, my home, my friends, chasing a dream that now feels distant in a place that's familiar on paper but foreign in spirit. Yet even in the uncertainty, there's a strange kind of peace settling in. Like the storm isn't over, but I've found a way to breathe inside it. Some part of me still believes there's hope here, that this chaos is carving out something better, even if I can't see it yet. I think I can feel it.

I sat there, letting the silence answer the questions I was too tired to ask. The bench felt cold beneath me, grounding in a way I hadn't expected. I pulled out my AirPods and tuned into my "Nights" playlist. My thoughts still raced, sure, but I stopped trying to chase them. I just told myself, "Let them run." Somewhere between the streetlight's flicker and the distant hum of a car engine, I realized I wasn't looking for answers anymore.

As I stood up to leave, I looked at that old oak tree one more time. It didn't say anything, but something about its stillness made me feel less alone.

*- With Love, Aj✨*
    `,
  },

  {
    slug: "the-night-i-questioned-everything",
    title: "The Night I Questioned Everything",
    excerpt: "4am, a missing moon, a scikit-learn error, and a text from a best friend that changed the whole night.",
    date: "June 8, 2025",
    readTime: "5 min",
    tag: "Nights",
    category: "nights",
    featured: false,
    content: `
# The Night I Questioned Everything

It was 4 a.m., and I couldn't sleep. I tried blasting my favorite "Nights" playlist and doing those slow breathing exercises, but my brain was like, "Nope, let's overthink instead." Desperate for calm, I stepped outside to find the moon. It was a chilly winter night, the sky glowing like a cloudy day, but the moon? Nowhere to be seen. Sitting on my porch, staring at the weirdly bright night, I started spiraling with my thoughts: What am I even doing? Why am I here in the USA? I didn't want answers, but my mind wouldn't quit.

Ugh, why does my brain pick the worst timing possible to hold TED Talks with itself? I wrapped my sweater tighter and sank deeper into my chair, replaying the last month. Back in India, I'd be curled up in my room, probably watching something, arguing with my best friend about what happened at the office, or laughing with friends while sipping tea at our favorite spot. Here? I'm dodging people and their small talk.

> The only way to make sense out of change is to plunge into it, move with it, and join the dance. — Alan Watts

The spiral got real when my mind gave me a reality check about my current semester and how I'm struggling to install scikit-learn in Python. I'm working my butt off, staying up late decoding lectures, and somehow on my way to pulling off good grades that I'm going to be proud of. But that night, all I could think was: Is it worth it? I missed my room, my freedom, the chaos in my apartment, and even my barber and tea wala bhaiya. Then I looked at my phone. A text from my best friend back home: "You're living your American dream, doing your masters, making new friends. You're set for life!" I laughed. I hoped she was right.

> Maybe I was expecting a tiny nudge from the universe to say, 'You're here for a reason, even if you can't see it yet.'

I looked up at the sky again, still no moon, but the clouds were shifting, letting me peek at a few stars. Those stars were twinkling like they were winking at me, and for a second, I felt a little less lost. I took a deep breath, the cold air snapping me back. Living the American dream, huh? Maybe not the Netflix version, but wrestling with Python code errors and acing my skills are my kind of epic right now. I'm not just surviving. I'm building something, even if it's messy and exhausting.

I chuckled, thinking about my latest culture shock. Last week, I tried explaining the magic of ginger chai to a classmate. The next day, he saw me drinking coffee alone at Dunkin and said, "So this is how you fix your day, huh?" That took me back home. Back in India, my tea wala bhaiya decided what kind of tea I needed by looking at my face after a long day at work. But then I remember the people I see here are different. Maybe I'm finding a new kind of temporary home, one error code at a time.

I shuffled back inside. Back to that scikit-learn error. It didn't feel like just a coding glitch. It felt like a metaphor for my whole semester. I'd spent hours debugging, only to realize I missed a single pip install. I wasn't ready to give up. Not on Python, not on my masters, not on this wild adventure. I added a reminder: Call Mom tomorrow. She'll probably say, don't lose sight of what I wanted to be and what I promised her. Six months in, I'm learning that doubting myself is part of the deal. It doesn't mean I'm failing. It means I'm trying.

*- With Love, Aj✨*
    `,
  },

  {
    slug: "the-night-i-started-accepting",
    title: "The Night I Started Accepting",
    excerpt: "Past 1am, a call from my brother, instant coffee, and the slow realization that the in-between is enough.",
    date: "June 12, 2025",
    readTime: "5 min",
    tag: "Nights",
    category: "nights",
    featured: false,
    content: `
# The Night I Started Accepting

It was past 1 a.m. when my brother's voice crackled through the call, laughing about a party I'd missed back home. I stared at the empty ceiling, the silence heavy, until I realized that night was about letting go and holding on in a new way.

The room was dark, except for the faint light coming from my laptop screen, still open to Python with half-written code. My brain, as usual, decided this was the perfect time to get into a full-on existential debate.

"So what is acceptance? And why do I need it?" were the first thoughts that hijacked my head. The call still echoing in my head, I pulled my sheets up. Back in India, I'd be at home, having fun with my brother and friends, probably arguing over who gets the leg piece in the biryani that we ordered, dancing like nobody's watching, or going on a night ride on our bikes. Here in the USA, I'm wrestling with pandas DataFrames and dodging awkward conversations.

I got up and went into the kitchen to get something to eat. I made myself some instant coffee because tea takes time. As the microwave hummed, I thought about the last couple of months. I'd been so focused on proving I could "make it" here. Acing my master's, debugging code like a pro, trying to fit into a world that felt like it was moving at a different speed. But that night, my brother's call reminded me of what I'd left behind: late-night chats, the chaos of home.

> The art of acceptance is the art of making peace with what is, while still holding space for what could be. — Unknown

> Acceptance, I realized, wasn't about giving up or settling. It was about making peace with the messiness of life.

Like when I finally got scikit-learn to work after three hours of Stack Overflow and a near meltdown, only to realize I'd been using the wrong Python environment. Or when I stopped trying to explain chai to my classmates and just offered them a sip instead. They didn't get it, but their confused smiles were enough. I'm not living the glossy "American dream" I imagined back in India, but all I'm doing is trying to build something real. One late-night coding session, one hesitant friendship, one homesick moment at a time.

I looked out the window, the streetlights casting a soft glow on the empty road. No moon tonight either, but the stars were out, faint but stubborn, like they were daring me to keep going. I thought about my brother's words: "You're out there doing big things!" He's half-right. The "big things" are less glamorous than I expected, more like surviving a group project with teammates who don't know what GitHub is, or figuring out how to make rice without a rice cooker. But they're mine. And maybe accepting that is what keeps me grounded.

Back in my room, I opened my laptop again. That Python code was still mocking me, but I didn't curse this time. I took a sip of my sad coffee, cracked my knuckles, and started typing. One line of code at a time. One step toward accepting that I'm not just chasing a degree or a dream. I'm learning to live in the in-between, where homesickness and hope coexist.

Two months ago, I was questioning everything. Now, I'm starting to accept that the doubts, the distance, the struggles, and the tiny wins are all part of the story. I'm not there yet, wherever "there" is, but I'm here. And that's enough for tonight.

*- With Love, Aj✨*
    `,
  },

  {
    slug: "whats-the-purpose",
    title: "The Night I Questioned - What's the Purpose?",
    excerpt: "A reflective piece on freedom, purpose, and the discomfort of not knowing — written at an hour I probably shouldn't be awake.",
    date: "April 10, 2026",
    readTime: "5 min",
    tag: "Nights",
    category: "nights",
    featured: false,
    content: `
# What's the Purpose?

![Purpose Sunset](/images/purpose-sunset.jpg)

Me? I am a free man. Free to choose my own thoughts, free to work, free to go on a trek, free to travel around the world or lie in bed all day doing nothing but eating pizza without anyone telling me how.

But that's the free part, the man part's a little different.

Growing up, I used to think that the whole point is to arrive somewhere, earn money, live a comfortable life. Like there'd be a point things made sense, thinking that adults had it figured out, their world is ordered, rational and for a purpose in life.
And when I got there. It doesn't.
The world isn't broken, it was never assembled in the first place. The order I thought when I was a kid, I was just too small to see the cracks.
This is what no one told me, and maybe that's a good news.
Because once I stop waiting for things to be fixed, I get to start living in what it actually is. I learned to move through the mess without needing it to resolve. And people might call it cynicism, but it's not. That's the closet thing to real freedom I've found.

> "In the midst of winter, I found there was within me an invincible summer." — Albert Camus

Freedom found inside the mess, not outside of it.

The reason why I penned this down for you to read is, not to quote something on existentialism, not to teach you how to live, it's just this thought lingering my head about what's the purpose of all this. At its simplest, maybe life is about three things: on a universal level, it's just about existing. On a human level, it's about raising the next generation to keep our story going. And on a social level, it's about the daily choice to simply be a good person. But even after all of that, something doesn't seam to fit, and maybe I will never know.
And I think that's okay.

Not in defeated way. Not in the way you shrug your shoulders and walk away from something too heavy to carry. More like, I've started to make peace with the open end of the question. Because every time I've chased an answer all the to way to its root, I find another door. Another "but why". It never really stopped.

Maybe the purpose isn't a destination that you arrive at. Maybe it's something you build, badly, and rebuild again. Like a sentence I keep editing and never quite publish (just like this blog I am writing). Or maybe, the thought where I keep coming back to, the discomfort of not knowing is the purpose. That restlessness, that itch. It's what kept me awake, kept me moving, kept me real.

Coming back to our question,I don't have an answer for you. I barely have one for myself. But I think that's the most honest thing I can offer.
What I am really trying to say this whole time is not that life is meaningless, but meaning wasn't pre-packaged. No manual, no fate, no arrival. And certainly no moment where it all clicks and stays clicked. It's just you, whatever you choose, and the discomfort of not having the answers.

I am still figuring it out. Some days it feels like charity; most days, it just feels like I am tired. But here I am, writing at an hour I shouldn’t be, and that feels like something. Maybe that’s enough for now.
*- With Love, Aj✨*
    `,
  },

  // ── DEAR STRANGER SERIES ──────────────────────────────────────────────────

  {
    slug: "dear-stranger-you-are-not-late",
    title: "Dear Stranger, You Are Not Late",
    excerpt: "On timelines that aren't real, paths that are your own, and the quiet truth that you're exactly where you need to be.",
    date: "July 2, 2025",
    readTime: "4 min",
    tag: "Dear Stranger",
    category: "dear-stranger",
    featured: false,
    content: `
# Dear Stranger, You Are Not Late

Dear Stranger,

I want to say something to you, and I need you to actually hear it: you are not late.

I know it might not feel that way. Maybe you opened Instagram today and saw someone your age announcing a new job, a new city, a new chapter, and you felt that familiar tightening in your chest. Maybe you compared your chapter three to someone else's chapter twelve and quietly decided you were behind.

> You are not behind. You are exactly where your story requires you to be right now.

The timeline you're measuring yourself against isn't real. It was assembled from a hundred different people's highlight reels, filtered through your most anxious moments, and presented to you as fact. It isn't fact. It's a feeling. And feelings, however persistent, are not the same as truth.

I think about the slow things. How trees that grow in difficult soil grow slower, but their rings are denser. How some of the most interesting people I've known took the longest to arrive at themselves. How the things I rushed toward often needed more time than I gave them.

There is something about the path you're on that is specific to you. The detours, the pauses, the seasons where nothing seemed to be happening but everything was quietly rearranging itself underneath. Those aren't delays. They're preparation.

You're not behind the person next to you. You're just on a different road, running a different race, building a different thing. The comparison collapses the moment you remember that.

Wherever you are on the path, it's right on time.

*- With Love, Aj✨*
    `,
  },

  {
    slug: "dear-stranger-please-be-softer",
    title: "Dear Stranger, Please Be Softer",
    excerpt: "On the lie that being hard on yourself is the responsible thing, and why you deserve the same grace you give everyone else.",
    date: "June 18, 2025",
    readTime: "3 min",
    tag: "Dear Stranger",
    category: "dear-stranger",
    featured: false,
    content: `
# Dear Stranger, Please Be Softer

Dear Stranger,

Please be softer with yourself.

I notice the way you talk about the things you haven't done yet. The slight edge of accusation in your own voice, the way you frame your rest as laziness, your uncertainty as failure, your pace as proof of some fundamental insufficiency.

You are not insufficient. You are tired. Sometimes those two things feel the same from the inside, but they are not the same.

> You don't have to earn your rest. You don't have to earn your worth. These things were yours before you ever proved anything.

I think we were taught, somewhere along the way, that softness is weakness. That being hard on yourself is the responsible thing, the motivated thing, the way ambitious people behave. But I've watched that belief quietly eat people alive. I've felt it try to do the same to me.

The truth is gentler than that. The truth is that the same care you extend to everyone else, the grace you give to friends when they stumble, the patience you offer when someone is struggling, you are allowed to give that to yourself too. Not as a reward. Not when you've earned it. Now. Always.

You're doing more than you think. You're carrying more than you show. And you deserve to move through your own life with the same softness you'd want for the people you love.

Please be softer with yourself. You're doing okay.

*- With Love, Aj✨*
    `,
  },

  {
    slug: "dear-stranger-keep-the-small-promises",
    title: "Dear Stranger, Keep the Small Promises",
    excerpt: "The quiet agreements you make with yourself each morning, and why keeping them is how you build trust with the only person always watching.",
    date: "June 1, 2025",
    readTime: "4 min",
    tag: "Dear Stranger",
    category: "dear-stranger",
    featured: false,
    content: `
# Dear Stranger, Keep the Small Promises

Dear Stranger,

I want to talk about the small promises.

Not the big ones. The vows and the declarations and the goals written in January with the full weight of a new year behind them. I mean the quiet ones. The ones you make to yourself in the morning before anyone else is awake. I'll go for a walk today. I'll call her back. I'll start that thing I've been avoiding.

Those small promises matter more than they look.

> The tiny agreements you make with yourself, and keep, are how you build trust with the only person who's always watching: you.

When you break the small promises habitually, something softens in how you see yourself. Not dramatically, not all at once, but slowly. The way a knot loosens over time. You begin to believe, in some quiet part of yourself, that you can't quite be counted on. And that belief seeps into the bigger things.

But the reverse is also true. Keep the small promises. Make them small enough that keeping them is almost embarrassing. I'll write one sentence. I'll drink one glass of water before noon. I'll step outside for five minutes. Then do those things. Then notice how it feels.

It feels like integrity. It feels like showing up for yourself in the same way you'd show up for someone else. And over time, it adds up to something you can actually stand on.

The small promises are practice for the life you're trying to build.

Keep them.

*- With Love, Aj✨*
    `,
  },

  {
    slug: "dear-stranger-its-okay-to-start-again",
    title: "Dear Stranger, It's Okay to Start Again",
    excerpt: "On invisible debts to old versions of ourselves, and the quiet courage it takes to put one story down and pick up a kinder one.",
    date: "May 20, 2025",
    readTime: "4 min",
    tag: "Dear Stranger",
    category: "dear-stranger",
    featured: false,
    content: `
# Dear Stranger, It's Okay to Start Again

Dear Stranger,

You are allowed to start again.

I know it might not feel like permission you need, but sometimes we carry these invisible debts, these obligations to the version of ourselves who began something, as though abandoning a path is a betrayal rather than a choice. As though the time you spent on the old thing makes it wrong to step away.

But here's the thing about time: the time is spent regardless. The question is only what you do with what's left.

> You can put the story down. You can pick up a kinder one. This is not failure. It is editing.

There's a particular kind of courage in the restart. It requires you to admit that where you were wasn't where you wanted to stay. It requires you to face the discomfort of being a beginner again, of not knowing, of being uncertain in front of others. That's not small.

I've watched people stay in things long past the point of meaning, out of fear of what starting over would say about them. I've done it myself. And every time, the moment I finally let go, the relief was the first thing I felt. Not failure. Relief.

You are not the sum of your unfinished things. You are what you build next.

Starting again isn't going backward. It's choosing a better direction.

*- With Love, Aj✨*
    `,
  },

  {
    slug: "dear-stranger-you-are-allowed-to-be-proud",
    title: "Dear Stranger, You're Allowed to Be Proud",
    excerpt: "On the habit of minimizing, the practice of acknowledging your own progress, and why you don't need anyone else to agree.",
    date: "May 5, 2025",
    readTime: "3 min",
    tag: "Dear Stranger",
    category: "dear-stranger",
    featured: false,
    content: `
# Dear Stranger, You're Allowed to Be Proud

Dear Stranger,

You're allowed to be proud of yourself.

I don't know why this feels like a radical thing to say, but I think it does for a lot of us. We've gotten very good at minimizing. At "oh, it's not that big a deal." At deflecting the compliment before it lands. At moving on to the next goal before we've let ourselves feel anything about the last one.

But progress counts. Even when no one else sees it. Even when it doesn't look impressive from the outside. Even when you're the only one who understands what it cost you to get here.

> You made it through something hard. That is worth something. Let yourself feel that.

I think the practice of acknowledging your own progress, quietly, privately, without needing it validated by anyone, is one of the most important things you can do for yourself. It teaches you that you are a fair witness to your own effort. It builds the kind of self-trust that doesn't collapse when the external approval runs dry.

You don't need to announce it. You don't need anyone else to agree. You can simply sit for a moment with what you've done and let it be enough.

You worked for it. You showed up when it was hard. You got here.

Be proud. You've earned it.

*- With Love, Aj✨*
    `,
  },
];

export function getTopPosts(n = 4): BlogPost[] {
  return blogPosts.slice(0, n);
}

export function getArticles(): BlogPost[] {
  return blogPosts.filter((p) => p.category === "article");
}

export function getNightsPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.category === "nights");
}

export function getDearStrangerPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.category === "dear-stranger");
}
