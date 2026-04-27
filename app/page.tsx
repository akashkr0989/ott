import { HomeExperience } from "@/components/home-experience";
import { heroSlides, contentRows } from "@/lib/content";

export default function Home() {
  return <HomeExperience contentRows={contentRows} heroSlides={heroSlides} />;
}
