import { useRef } from 'react';
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { X, Upload, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SupportingDocumentsProps {
  documents: File[];
  onDocumentsChange: (documents: File[]) => void;
}

export function SupportingDocuments({ documents, onDocumentsChange }: SupportingDocumentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (documents.length + files.length > 5) {
      toast.error('You can only upload up to 5 supporting documents');
      return;
    }
    onDocumentsChange([...documents, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    onDocumentsChange(newDocuments);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Supporting Documents (Optional)</Label>
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={documents.length >= 5}
          className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        multiple
        accept=".pdf,.doc,.docx,.txt,.rtf"
      />
      {documents.map((doc, index) => (
        <Card key={index}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{doc.name}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeDocument(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}