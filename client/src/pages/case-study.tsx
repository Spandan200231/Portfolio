import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Tag, ExternalLink } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";

export default function CaseStudy() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();

  const { data: caseStudy, isLoading, error } = useQuery({
    queryKey: [`/api/case-studies/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-6 py-8">
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-64 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (error || !caseStudy) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-contrast">Case Study Not Found</h1>
            <p className="text-contrast-secondary">
              The case study you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => setLocation("/")} className="btn-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="flex items-center space-x-2 text-contrast hover:text-accent"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Portfolio</span>
              </Button>
              
              <div className="text-sm font-medium text-contrast">
                Case Study
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="py-16 bg-secondary/50 dark:bg-gray-800/50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="flex justify-center space-x-2 mb-4">
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  Case Study
                </Badge>
                {caseStudy.category && (
                  <Badge variant="secondary">{caseStudy.category}</Badge>
                )}
              </div>
              
              <h1 className="heading-primary">{caseStudy.title}</h1>
              
              {caseStudy.subtitle && (
                <p className="text-xl text-contrast-secondary leading-relaxed max-w-2xl mx-auto">
                  {caseStudy.subtitle}
                </p>
              )}

              <div className="flex justify-center items-center space-x-6 text-sm text-contrast-secondary">
                {caseStudy.duration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{caseStudy.duration}</span>
                  </div>
                )}
                
                {caseStudy.tags && caseStudy.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4" />
                    <span>{caseStudy.tags.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {caseStudy.imageUrl && (
          <section className="py-8">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <img
                  src={caseStudy.imageUrl}
                  alt={caseStudy.title}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        <main className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Description */}
              {caseStudy.description && (
                <div className="mb-12">
                  <h2 className="text-2xl font-semibold text-contrast mb-6">Overview</h2>
                  <p className="text-lg body-text leading-relaxed">
                    {caseStudy.description}
                  </p>
                </div>
              )}

              {/* Main Content */}
              {caseStudy.content && (
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="body-text"
                    dangerouslySetInnerHTML={{ __html: caseStudy.content }}
                  />
                </div>
              )}

              {/* Tags Section */}
              {caseStudy.tags && caseStudy.tags.length > 0 && (
                <div className="mt-16 pt-8 border-t border-border">
                  <h3 className="text-lg font-semibold text-contrast mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-16 pt-8 border-t border-border">
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/")}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Portfolio</span>
                  </Button>

                  <Button
                    onClick={() => setLocation("/#contact")}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Start a Project</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card py-8">
          <div className="container mx-auto px-6">
            <div className="text-center text-sm text-contrast-secondary">
              <p>&copy; 2024 Spandan Majumder. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
