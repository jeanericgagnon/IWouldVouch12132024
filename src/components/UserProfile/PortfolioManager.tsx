import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X, FileText, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PortfolioItem {
  type: string;
  name: string;
  url?: string;
}

interface PortfolioManagerProps {
  portfolioItems: PortfolioItem[];
  onChange: (items: PortfolioItem[]) => void;
}

export function PortfolioManager({ portfolioItems, onChange }: PortfolioManagerProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemType, setItemType] = useState('');
  const [otherType, setOtherType] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemUrl, setItemUrl] = useState('');

  const handleAddItem = () => {
    if (portfolioItems.length >= 5) {
      toast.error('You can only add up to 5 portfolio items');
      return;
    }

    const type = itemType === 'Other' ? otherType : itemType;
    if (!type || !itemName) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newItem: PortfolioItem = {
      type,
      name: itemName,
      url: itemUrl || undefined
    };

    onChange([...portfolioItems, newItem]);
    setIsAddingItem(false);
    setItemType('');
    setOtherType('');
    setItemName('');
    setItemUrl('');
    toast.success('Portfolio item added successfully!');
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...portfolioItems];
    newItems.splice(index, 1);
    onChange(newItems);
    toast.success('Portfolio item removed successfully!');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Portfolio Items ({portfolioItems.length}/5)</h3>
        <Button
          onClick={() => setIsAddingItem(true)}
          disabled={portfolioItems.length >= 5}
          className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
        >
          Add Item
        </Button>
      </div>

      <div className="space-y-4">
        {portfolioItems.map((item, index) => (
          <Card key={index}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
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
                  onClick={() => handleRemoveItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
                  <SelectItem value="Publication">Publication</SelectItem>
                  <SelectItem value="Certification">Certification</SelectItem>
                  <SelectItem value="Award">Award</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {itemType === 'Other' && (
              <div className="space-y-2">
                <Label>Specify Type</Label>
                <Input
                  value={otherType}
                  onChange={(e) => setOtherType(e.target.value)}
                  placeholder="Enter type"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Enter name"
              />
            </div>

            <div className="space-y-2">
              <Label>URL (optional)</Label>
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
              disabled={!itemType || !itemName || (itemType === 'Other' && !otherType)}
              className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}