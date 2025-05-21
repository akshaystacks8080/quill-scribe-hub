
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/hooks/useProfile";

const creditPackages = [
  {
    id: "small",
    credits: 20,
    price: "$5.99",
    description: "Good for small projects",
  },
  {
    id: "medium",
    credits: 100,
    price: "$19.99",
    description: "Most popular option",
    popular: true,
  },
  {
    id: "large",
    credits: 500,
    price: "$59.99",
    description: "Best value for frequent users",
  },
];

export function CreditsPage() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(creditPackages[1].id);
  
  const handlePurchase = () => {
    const creditPack = creditPackages.find(pack => pack.id === selectedPackage);
    if (!creditPack) return;
    
    navigate("/dashboard/payment", {
      state: {
        type: "credits",
        credits: creditPack.credits,
        price: creditPack.price
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Purchase Credits</h1>
          <p className="text-muted-foreground">
            Add more credits to your account
          </p>
        </div>
        
        <div className="max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Select Credit Package</CardTitle>
              <CardDescription>
                Currently you have {profile?.credits_total && profile?.credits_used 
                  ? profile.credits_total - profile.credits_used 
                  : 0} credits remaining
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage} className="space-y-4">
                {creditPackages.map((pack) => (
                  <div key={pack.id} className={`flex items-start space-x-3 border rounded-lg p-4 
                    ${pack.popular ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
                    <RadioGroupItem value={pack.id} id={pack.id} className="mt-1" />
                    <div className="flex flex-col gap-1">
                      <Label htmlFor={pack.id} className="text-base font-medium">
                        {pack.credits} Credits
                      </Label>
                      <div className="flex justify-between w-full">
                        <span className="text-sm text-muted-foreground">
                          {pack.description}
                        </span>
                        <span className="font-bold">
                          {pack.price}
                        </span>
                      </div>
                      {pack.popular && (
                        <span className="text-xs font-medium text-primary mt-1">
                          Most Popular
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePurchase} className="w-full">
                Continue to Payment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
