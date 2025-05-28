import { HeroSection } from '@/components/storefront/landing/HeroSection';
import { FeatureCards } from '@/components/storefront/landing/FeatureCard';
import { HowItWorks } from '@/components/storefront/landing/HowItWorks';
import { TeamFeatures } from '@/components/storefront/landing/TeamFeatures';
import { Testimonials } from '@/components/storefront/common/Testimonials';
import { PricingSection } from '@/components/storefront/common/Pricing';
import { ComparisonTable } from '@/components/storefront/landing/ComparisonTable';
import { FaqSection } from '@/components/storefront/landing/FaqSection';
import { CtaSection } from '@/components/storefront/landing/CTASection';
import { Footer } from '@/components/storefront/common/Footer';
import { Navbar } from '@/components/storefront/common/Navbar';
import { currentUser } from '@/actions/user';

export default async function Home() {
  const user = await currentUser();
  return (
    <div>
      <Navbar userId={user?.id} />
      <main>
        <HeroSection userId={user?.id} />
        <FeatureCards />
        <HowItWorks />
        <TeamFeatures />
        <CtaSection
          title="Ready to streamline your team's email workflow?"
          primaryButtonText='Get Started'
          secondaryButtonText='Learn More'
        />
        <Testimonials />
        <PricingSection />
        <ComparisonTable />
        <FaqSection />
        <CtaSection
          title="Ready to transform your team's inbox?"
          primaryButtonText='Get Started'
          secondaryButtonText='Contact Sales'
        />
      </main>
      <Footer />
    </div>
  );
}
