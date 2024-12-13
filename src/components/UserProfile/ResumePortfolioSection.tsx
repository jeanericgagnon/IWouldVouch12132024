import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileText, Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface PortfolioItem {
  type: string;
  name: string;
  url: string;
}

interface ResumePortfolioSectionProps {
  resumeUrl?: string;
  portfolioItems: PortfolioItem[];
  onUpdateResume: (file: File) => void;
  onUpdatePortfolio: (items: PortfolioItem[]) => void;
}

export function ResumePortfolioSection({
  resumeUrl,
  portfolioItems,
  onUpdateResume,
  onUpdatePortfolio
}: ResumePortfolioSectionProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemType, setItemType] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemUrl, setItemUrl] = useState('');

  const handleAddItem = () => {
    if (itemType && itemName && itemUrl) {
      onUpdatePortfolio([...portfolioItems, { type: itemType, name: itemName, url: itemUrl }]);
      setItemType('');
      setItemName('');
      setItemUrl('');
      setIsAddingItem(false);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...portfolioItems];
    newItems.splice(index, 1);
    onUpdatePortfolio(newItems);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume & Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Resume</Label>
          <div className="flex items-center space-x-4">
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpdateResume(file);
              }}
              className="hidden"
              id="resume-upload"
            />
            <Label htmlFor="resume-upload" className="cursor-pointer">
              <Button className="bg-[#52789e] hover:bg-[#6b9cc3] text-white">
                <Upload className="mr-2 h-4 w-4" />
                {resumeUrl ? 'Update Resume' : 'Upload Resume'}
              </Button>
            </Label>
            {resumeUrl && (
              <Button variant="outline" onClick={() => window.open(resumeUrl, '_blank')}>
                <FileText className="mr-2 h-4 w-4" />
                View Current Resume
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Portfolio Items ({portfolioItems.length}/5)</Label>
            <Button
              onClick={() => setIsAddingItem(true)}
              disabled={portfolioItems.length >= 5}
              className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
            >
              Add Item
            </Button>
          </div>

          <div className="space-y-2">
            {portfolioItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.type}</p>
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Portfolio Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={itemType} onValueChange={setItemType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Publication">Publication</SelectItem>
                    <SelectItem value="Certification">Certification</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={itemUrl}
                  onChange={(e) => setItemUrl(e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddItem}
                disabled={!itemType || !itemName || !itemUrl}
                className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
              >
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}