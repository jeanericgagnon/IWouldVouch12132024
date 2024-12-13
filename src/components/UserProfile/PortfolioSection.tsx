import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { FileText, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface PortfolioItem {
  type: string;
  name: string;
  url: string;
}

interface PortfolioSectionProps {
  items: PortfolioItem[];
  resumeUrl?: string;
}

export function PortfolioSection({ items, resumeUrl }: PortfolioSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + itemsPerPage) % items.length);
  };

  const prevPage = () => {
    setCurrentIndex((prev) => 
      prev - itemsPerPage < 0 
        ? Math.max(items.length - itemsPerPage, 0)
        : prev - itemsPerPage
    );
  };

  const visibleItems = items.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Portfolio & Resume</CardTitle>
        {resumeUrl && (
          <Button
            variant="outline"
            onClick={() => window.open(resumeUrl, '_blank')}
            className="ml-auto"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Resume
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visibleItems.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-card rounded-lg border p-4 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {item.type}
                      </Badge>
                      <h4 className="font-medium">{item.name}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(item.url, '_blank')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  className={cn(
                    "p-2",
                    currentIndex === 0 && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  className={cn(
                    "p-2",
                    currentIndex + itemsPerPage >= items.length && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={currentIndex + itemsPerPage >= items.length}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No portfolio items yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}