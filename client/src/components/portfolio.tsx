import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Eye, FolderSync, AlertCircle } from "lucide-react";

export default function Portfolio() {
  const { data: portfolioItems = [], isLoading, error } = useQuery({
    queryKey: ["/api/portfolio"],
  });

  const { data: socialContent } = useQuery({
    queryKey: ["/api/content/social"],
  });

  const behanceUrl = socialContent?.content?.behance || "https://www.behance.net/spandanmajumder3";

  if (error) {
    return (
      <section id="portfolio" className="py-20 bg-secondary/30 dark:bg-gray-800/30">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Alert className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Unable to load portfolio items. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 bg-secondary/30 dark:bg-gray-800/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="heading-secondary mb-6">Featured Work</h2>
          <p className="body-text max-w-2xl mx-auto mb-8">
            A curated selection of my recent projects showcasing user-centered design solutions across various digital platforms.
          </p>
        </div>

        {/* Portfolio Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="portfolio-card">
                <Skeleton className="w-full h-64" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : portfolioItems.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 animate-fade-in-up">
            {portfolioItems.map((item: any, index: number) => (
              <div key={`portfolio-${item.id}-${index}`} className="portfolio-card group">
                <div className="relative overflow-hidden">
                  <img
                    src={item.imageUrl || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-2">
                      {item.projectUrl && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(item.projectUrl, "_blank")}
                          className="bg-white/90 text-black hover:bg-white"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Project
                        </Button>
                      )}
                    </div>
                  </div>
                  {item.featured && (
                    <Badge className="absolute top-4 right-4 bg-accent text-white">
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-contrast group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="body-text text-sm mb-4 line-clamp-2">
                    {item.description || "Design project showcasing modern UI/UX principles and user-centered approach."}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.category && (
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                    {item.tags?.slice(0, 2).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {item.behanceId && (
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs text-behance border-behance/20">
                        From Behance
                      </Badge>
                      {item.projectUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(item.projectUrl, "_blank")}
                          className="text-accent hover:text-accent/80"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <div className="h-24 w-24 mx-auto bg-secondary/50 rounded-full flex items-center justify-center">
                <FolderSync className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-contrast">No Portfolio Items Yet</h3>
              <p className="body-text">
                Portfolio items will appear here once they're synced from Behance or added manually.
              </p>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center animate-fade-in-up">
          <Button
            onClick={() => window.open(behanceUrl, "_blank")}
            className="btn-primary flex items-center space-x-2"
          >
            <span>View Full Portfolio</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}