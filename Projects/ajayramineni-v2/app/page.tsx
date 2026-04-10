import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import FeaturedWork from "@/components/sections/FeaturedWork";
import Skills from "@/components/sections/Skills";
import RecentPosts from "@/components/sections/RecentPosts";
import CTA from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedWork />
      <Skills />
      <RecentPosts />
      <CTA />
    </>
  );
}
