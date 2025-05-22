import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { rewriteText } from "@/services/rewriter.service";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const tools = [
  { id: "paraphraser", label: "Paraphraser" },
  { id: "grammar-checker", label: "Grammar Checker" },
  { id: "plagiarism-checker", label: "Plagiarism Checker" },
  { id: "summarizer", label: "Summarizer" },
  { id: "translate", label: "Translate" },
];

export function HomePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // New states for drawer and selected tool
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("paraphraser");

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
      {/* Hamburger menu button fixed top-left */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-white hover:bg-primary-dark focus:outline-none"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        aria-label="Toggle Tools Menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-300 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4">Tools</h3>
          <ul className="space-y-2">
            {tools.map((tool) => (
              <li
                key={tool.id}
                className={`cursor-pointer px-3 py-2 rounded-md ${
                  selectedTool === tool.id ? "bg-primary text-white" : "hover:bg-primary/20"
                }`}
                onClick={() => {
                  setSelectedTool(tool.id);
                  setIsDrawerOpen(false);
                }}
              >
                {tool.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

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
          <div className="bg-primary text-primary-foreground rounded-lg p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to transform your writing?</h2>
            <p className="text-lg mb-8">Sign up now and get 3 free rewrites to try it out!</p>
            <Link to="/signup">
              <Button size="lg">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}