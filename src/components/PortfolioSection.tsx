import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { FileText, Link as LinkIcon } from 'lucide-react';

interface PortfolioItem {
  type: string;
  name: string;
  url: string;
}

interface PortfolioSectionProps {
  items: PortfolioItem[];
  isOwner?: boolean;
}

export function PortfolioSection({ items, isOwner }: PortfolioSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {isOwner ? "Add your portfolio items to showcase your work" : "No portfolio items yet"}
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.type}</p>
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}