
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { updateSubscription } from "@/services/profile.service";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const tiers = [
  {
    name: "Free",
    id: "free",
    price: "$0",
    credits: 20,
    features: [
      "20 text rewrites per month",
      "Basic text rewriting",
      "1 project at a time",
      "Standard support",
    ],
  },
  {
    name: "Pro",
    id: "pro",
    price: "$9.99",
    credits: 100,
    features: [
      "100 text rewrites per month",
      "Advanced text rewriting",
      "Unlimited projects",
      "Priority support",
      "Access to all writing styles",
      "Bulk processing",
    ],
    popular: true,
  },
  {
    name: "Business",
    id: "business",
    price: "$29.99",
    credits: 500,
    features: [
      "500 text rewrites per month",
      "Advanced text rewriting",
      "Unlimited projects",
      "Priority support",
      "Access to all writing styles",
      "Bulk processing",
      "API access",
      "Team sharing",
    ],
  },
];

export function PricingPage() {
  const { user } = useAuth();
  const { profile, refreshProfile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      navigate("/signup");
      return;
    }

    setProcessing(tierId);
    try {
      // Find the tier
      const tier = tiers.find(t => t.id === tierId);
      if (!tier) return;
      
      // Update subscription (we're mocking this)
      await updateSubscription(user.id, tierId, tier.credits);
      
      // Refresh profile to get updated data
      await refreshProfile();
      
      toast({
        title: "Subscription updated",
        description: `You are now subscribed to the ${tier.name} plan`,
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="py-12">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that best fits your needs. All plans come with a 7-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`border rounded-lg overflow-hidden ${
                tier.popular
                  ? "border-primary shadow-lg scale-105 relative z-10"
                  : "border-border"
              }`}
            >
              {tier.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-1 text-muted-foreground">
                  {tier.credits} credits per month
                </p>

                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {profile && profile.subscription_tier === tier.id ? (
                    <Button className="w-full" variant="outline" disabled>
                      Current plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleSubscribe(tier.id)}
                      disabled={!!processing}
                    >
                      {processing === tier.id
                        ? "Processing..."
                        : user
                        ? "Subscribe"
                        : "Sign up"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-muted/30 p-8 rounded-lg text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Need more credits?</h3>
          <p className="text-muted-foreground mb-6">
            Contact us for custom plans or purchase additional credits as needed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button variant="outline">Contact Us</Button>
            </Link>
            <Link to={user ? "/dashboard/credits" : "/signup"}>
              <Button>Buy Additional Credits</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
