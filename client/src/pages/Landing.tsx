import {
  Hero,
  PressLogos,
  FeaturedCelebrities,
  HowItWorks,
  Testimonials,
  StatsBar,
  FinalCTA,
} from '@/components/landing';
import { Footer } from '@/components';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <PressLogos />
      <FeaturedCelebrities />
      <HowItWorks />
      <Testimonials />
      <StatsBar />
      <FinalCTA />
      <Footer />
    </div>
  );
};
