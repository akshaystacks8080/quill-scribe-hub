
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/components/ui/use-toast";
import { updateSubscription } from "@/services/profile.service";
import { CreditCard } from "lucide-react";

type PaymentType = "subscription" | "credits";

interface PaymentState {
  type: PaymentType;
  planId?: string;
  planName?: string;
  price?: string;
  credits?: number;
}

export function PaymentPage() {
  const { user } = useAuth();
  const { refreshProfile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentState | null>(null);
  
  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Get payment details from location state
  useEffect(() => {
    const state = location.state as PaymentState;
    if (!state || !state.type) {
      navigate("/dashboard");
      return;
    }
    
    setPaymentInfo(state);
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !paymentInfo) return;
    
    try {
      setLoading(true);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (paymentInfo.type === "subscription" && paymentInfo.planId) {
        // Update subscription in Supabase
        const credits = paymentInfo.credits || 0;
        await updateSubscription(user.id, paymentInfo.planId, credits);
        
        toast({
          title: "Subscription updated",
          description: `You have successfully subscribed to the ${paymentInfo.planName} plan`,
        });
      } 
      else if (paymentInfo.type === "credits" && paymentInfo.credits) {
        // Add credits in Supabase
        await updateSubscription(user.id, "free", paymentInfo.credits);
        
        toast({
          title: "Credits purchased",
          description: `${paymentInfo.credits} credits have been added to your account`,
        });
      }
      
      // Refresh profile to get updated data
      await refreshProfile();
      
      // Redirect back to dashboard
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!paymentInfo) {
    return null;
  }

  const formatCardNumber = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    // Add space every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const getTitle = () => {
    if (paymentInfo.type === "subscription") {
      return `Subscribe to ${paymentInfo.planName} Plan`;
    }
    return "Purchase Additional Credits";
  };

  const getDescription = () => {
    if (paymentInfo.type === "subscription") {
      return `${paymentInfo.price}/month for ${paymentInfo.credits} credits`;
    }
    return `${paymentInfo.credits} credits for ${paymentInfo.price}`;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6 max-w-md mx-auto">
        <div>
          <h1 className="text-3xl font-bold">{getTitle()}</h1>
          <p className="text-muted-foreground">
            Complete your payment to continue
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <div className="relative">
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    required
                    maxLength={19}
                  />
                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card-name">Cardholder Name</Label>
                <Input
                  id="card-name"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    required
                    maxLength={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    required
                    maxLength={3}
                    type="password"
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : `Pay ${paymentInfo.price}`}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
