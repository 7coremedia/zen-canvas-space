import { Helmet } from "react-helmet-async";
import OnboardingForm from "@/components/forms/OnboardingForm";

export default function Onboarding() {
  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Start Your Brand – KING</title>
        <meta name="description" content="Client onboarding hub: tell KING about your brand vision and needs." />
        <link rel="canonical" href="/onboarding" />
      </Helmet>
      <h1 className="font-display text-4xl">Start Your Brand Journey</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Answer a few questions so I can understand your goals and tailor a winning path.</p>
      <div className="mt-8">
        <OnboardingForm />
      </div>
    </main>
  );
}
