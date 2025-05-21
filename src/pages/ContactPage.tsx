
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    toast({
      title: "Message sent",
      description: "We've received your message and will get back to you soon!",
    });
    
    // Reset form
    setName("");
    setEmail("");
    setMessage("");
    setLoading(false);
  };

  return (
    <div className="py-12">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">
            We're here to help! Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
              <CardDescription>
                Find us using the information below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-1">Email</h3>
                <p className="text-muted-foreground">support@textcraft.example</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Support Hours</h3>
                <p className="text-muted-foreground">Monday - Friday: 9am - 5pm EST</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Office</h3>
                <p className="text-muted-foreground">
                  123 AI Avenue<br />
                  Tech City, TC 12345<br />
                  United States
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Send a Message</CardTitle>
              <CardDescription>
                Fill out the form below to get in touch with us
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    className="min-h-[150px]"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">How does the text rewriter work?</h3>
              <p className="text-muted-foreground">
                Our AI-powered text rewriter analyzes your content and rewrites it to maintain the original meaning while making it more human-like and unique.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I try it before subscribing?</h3>
              <p className="text-muted-foreground">
                Yes! You can try our text rewriter on the home page without creating an account. To save your projects, you'll need to sign up.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">What are credits?</h3>
              <p className="text-muted-foreground">
                Credits are used to rewrite text. Each rewrite consumes one credit. Different plans come with different amounts of credits.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I upgrade my plan later?</h3>
              <p className="text-muted-foreground">
                Absolutely! You can upgrade or downgrade your plan at any time from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
