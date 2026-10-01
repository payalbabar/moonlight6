import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { use1AMWallet } from "../hooks/use1AMWallet";
import { playClickSound } from "../utils/audio";
import OnboardingGuide from "../components/OnboardingGuide";
import FeedbackModal from "../components/FeedbackModal";

// 11 Landing Sections
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import ProblemSection from "../components/landing/ProblemSection";
import SolutionSection from "../components/landing/SolutionSection";
import HowItWorks from "../components/landing/HowItWorks";
import Architecture from "../components/landing/Architecture";
import Security from "../components/landing/Security";
import ProductDemo from "../components/landing/ProductDemo";
import TechStack from "../components/landing/TechStack";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isConnected, account, isConnecting, connect } = use1AMWallet();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleLaunch = () => {
    playClickSound();
    navigate("/app");
  };

  const handleConnect = async () => {
    playClickSound();
    try {
      await connect();
    } catch {
      // Handled in context
    }
  };

  const scrollToHowItWorks = () => {
    playClickSound();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="sv-landing-root">
      {/* 1. Navbar */}
      <Navbar
        onLaunch={handleLaunch}
        isConnected={isConnected}
        account={account}
        onConnect={handleConnect}
        isConnecting={isConnecting}
      />

      {/* 2. Hero */}
      <Hero
        onHideKey={handleLaunch}
        onSeeHowItWorks={scrollToHowItWorks}
      />

      {/* 3. Problem */}
      <ProblemSection />

      {/* 4. Solution (Red / Bone Horizontal Split) */}
      <SolutionSection />

      {/* 5. How It Works (5 Steps Sequence) */}
      <HowItWorks />

      {/* 6. Architecture (Bone Background & SVG Pipeline) */}
      <Architecture />

      {/* 7. Security (5 Giant Typography Rows) */}
      <Security />

      {/* 8. Product Demo (3-Column HTML/CSS App Mockup) */}
      <ProductDemo />

      {/* 9. Tech Stack (Clean Table Rows) */}
      <TechStack />

      {/* 10. Final CTA (Full Red Section) */}
      <FinalCTA onLaunch={handleLaunch} />

      {/* 11. Footer */}
      <Footer
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      {/* Interactive Helper Modals (Preserved) */}
      <OnboardingGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}
