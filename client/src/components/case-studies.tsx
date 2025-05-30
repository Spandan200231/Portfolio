import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Clock, Tag, AlertCircle, BookOpen } from "lucide-react";

export default function CaseStudies() {
  const [, setLocation] = useLocation();

  const { data: caseStudies = [], isLoading, error } = useQuery({
    queryKey: ["/api/case-studies"],
  });

  if (error) {
    return (
      <section id="case-studies" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Alert className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Unable to load case studies. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="case-studies" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="heading-secondary mb-6">Case Studies</h2>
          <p className="body-text max-w-2xl mx-auto">
            Deep dives into my design process, challenges faced, and solutions delivered for complex user experience problems.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-16">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-3/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-10 w-40" />
                </div>
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Case Studies */}
        {!isLoading && caseStudies.length > 0 && (
          <div className="space-y-16 animate-fade-in-up">
            {caseStudies.map((study: any, index: number) => (
              <div 
                key={study.id} 
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="space-y-4">
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      {study.category || "UX Case Study"}
                    </Badge>

                    <h3 className="text-3xl font-bold text-contrast hover:text-accent transition-colors">
                      {study.title}
                    </h3>

                    {study.subtitle && (
                      <p className="text-lg text-accent font-medium">
                        {study.subtitle}
                      </p>
                    )}

                    <p className="body-text leading-relaxed">
                      {study.description || "A comprehensive design case study showcasing the complete design process from research to final implementation."}
                    </p>
                  </div>

                  {/* Meta Information */}
                  <div className="space-y-3">
                    {study.duration && (
                      <div className="flex items-center text-sm text-contrast-secondary">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{study.duration}</span>
                      </div>
                    )}

                    {study.tags && study.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {study.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => setLocation(`/case-study/${study.slug}`)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="relative group">
                    <img
                      src={study.imageUrl || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"}
                      alt={study.title}
                      className="rounded-xl shadow-2xl w-full h-80 object-cover group-hover:shadow-3xl transition-shadow duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Overlay Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        onClick={() => setLocation(`/case-study/${study.slug}`)}
                        className="bg-white/90 text-black hover:bg-white shadow-lg"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Read Case Study
                      </Button>
                    </div>
                  </div>

                  {study.featured && (
                    <Badge className="absolute top-4 right-4 bg-accent text-white shadow-lg">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && caseStudies.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <div className="h-24 w-24 mx-auto bg-secondary/50 rounded-full flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-contrast">No Case Studies Yet</h3>
              <p className="body-text">
                Detailed case studies will be published here to showcase the design process and methodologies.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}