
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { rewriteText } from "@/services/rewriter.service";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export function HomePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRewrite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      toast({
        title: "No text to rewrite",
        description: "Please enter some text to rewrite",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const rewrittenText = await rewriteText(inputText);
      setOutputText(rewrittenText);
    } catch (error) {
      console.error("Error rewriting text:", error);
      toast({
        title: "Error",
        description: "Failed to rewrite text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-primary/20 to-background py-20">
        <div className="container">
          <div className="flex flex-col items-center text-center gap-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Transform Your Writing with AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Make your text more engaging, natural, and human-like with our AI-powered text rewriter.
            </p>
            {!user && (
              <div className="flex gap-4">
                <Link to="/signup">
                  <Button size="lg">Get started</Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg">View pricing</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Text rewriter tool */}
      <section className="py-12">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-8">Try our text rewriter</h2>
          <form onSubmit={handleRewrite} className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Text</CardTitle>
                <CardDescription>
                  Enter the text you want to rewrite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Enter your text here..." 
                  className="min-h-[200px]"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={isProcessing || !inputText.trim()}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Rewrite Text"}
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Rewritten Text</CardTitle>
                <CardDescription>
                  Your rewritten text will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Rewritten text will appear here..." 
                  className="min-h-[200px]" 
                  value={outputText}
                  readOnly
                />
              </CardContent>
              <CardFooter className="flex gap-2">
                {outputText && (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-1/2"
                      onClick={() => navigator.clipboard.writeText(outputText)}
                    >
                      Copy Text
                    </Button>
                    {user ? (
                      <Link to="/dashboard/projects/new" state={{ text: inputText, rewritten: outputText }} className="w-1/2">
                        <Button className="w-full">Save Project</Button>
                      </Link>
                    ) : (
                      <Link to="/signup" className="w-1/2">
                        <Button className="w-full">Sign up to Save</Button>
                      </Link>
                    )}
                  </>
                )}
              </CardFooter>
            </Card>
          </form>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TextCraft?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Human-like Text</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our AI generates text that feels natural and human-written, perfect for bypassing AI detection.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fast & Efficient</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Transform your text in seconds with our powerful AI rewriting technology.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Save & Organize</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Store all your rewritten texts in one place for easy access and management.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Multiple Styles</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Customize your rewritten text with different tones and writing styles.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Affordable Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Choose from multiple subscription plans to fit your needs and budget.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>High Quality Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get professionally rewritten content that maintains the original meaning while sounding fresh.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your writing?</h2>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get started with TextCraft today and take your content to the next level.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={user ? "/dashboard" : "/signup"}>
                <Button size="lg">
                  {user ? "Go to Dashboard" : "Sign up for Free"}
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">See our Plans</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
