import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { FileText, Link as LinkIcon, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PortfolioItem {
  type: string;
  name: string;
  url: string;
}

interface PortfolioSectionProps {
  items: PortfolioItem[];
  onChange: (items: PortfolioItem[]) => void;
}

export function PortfolioSection({ items, onChange }: PortfolioSectionProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemType, setItemType] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemUrl, setItemUrl] = useState('');

  const handleAddItem = () => {
    if (!itemType || !itemName || !itemUrl) {
      toast.error('Please fill in all fields');
      return;
    }

    if (items.length >= 5) {
      toast.error('You can only add up to 5 portfolio items');
      return;
    }

    onChange([...items, { type: itemType, name: itemName, url: itemUrl }]);
    setItemType('');
    setItemName('');
    setItemUrl('');
    setIsAddingItem(false);
    toast.success('Portfolio item added successfully!');
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
    toast.success('Portfolio item removed successfully!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>Showcase your work and achievements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Portfolio Items ({items.length}/5)</Label>
          <Button
            onClick={() => setIsAddingItem(true)}
            disabled={items.length >= 5}
            className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
          >
            Add Item
          </Button>
        </div>

        {items.map((item, index) => (
          <Card key={index}>
            <CardContent className="flex items-center justify-between p-4">
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
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

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
                    <SelectItem value="Publication">Publication</SelectItem>
                    <SelectItem value="Certification">Certification</SelectItem>
                    <SelectItem value="Award">Award</SelectItem>
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