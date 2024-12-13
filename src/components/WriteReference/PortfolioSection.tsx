import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FileText, Link as LinkIcon, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PortfolioSectionProps {
  portfolioItems: Array<{ type: string; name: string; url?: string }>;
  onPortfolioItemsChange: (items: Array<{ type: string; name: string; url?: string }>) => void;
}

export function PortfolioSection({ portfolioItems, onPortfolioItemsChange }: PortfolioSectionProps) {
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [portfolioType, setPortfolioType] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const handleAddPortfolioItem = () => {
    if (!portfolioType || !portfolioUrl) {
      toast.error('Please fill in all portfolio item fields');
      return;
    }

    if (portfolioItems.length >= 5) {
      toast.error('You can only add up to 5 portfolio items');
      return;
    }

    onPortfolioItemsChange([...portfolioItems, {
      type: portfolioType,
      name: portfolioUrl,
      url: portfolioUrl
    }]);
    setPortfolioType('');
    setPortfolioUrl('');
    setIsPortfolioModalOpen(false);
    toast.success('Portfolio item added successfully!');
  };

  const handleRemovePortfolioItem = (index: number) => {
    const newItems = [...portfolioItems];
    newItems.splice(index, 1);
    onPortfolioItemsChange(newItems);
    toast.success('Portfolio item removed successfully!');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Supporting Documents (Optional)</Label>
        <Button
          type="button"
          onClick={() => setIsPortfolioModalOpen(true)}
          className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
          disabled={portfolioItems.length >= 5}
        >
          Add Document
        </Button>
      </div>

      {portfolioItems.map((item, index) => (
        <Card key={index} className="transition-all duration-200 hover:shadow-md">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{item.type}</p>
                <p className="text-sm text-muted-foreground">{item.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {item.url && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePortfolioItem(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isPortfolioModalOpen} onOpenChange={setIsPortfolioModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Supporting Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={portfolioType} onValueChange={setPortfolioType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Code Sample">Code Sample</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Certification">Certification</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-[#52789e] hover:bg-[#6b9cc3] text-white"
              onClick={handleAddPortfolioItem}
            >
              Add Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}