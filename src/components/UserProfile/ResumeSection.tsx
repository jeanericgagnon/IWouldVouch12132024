import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ResumeSectionProps {
  currentResumeUrl?: string;
  onResumeChange: (file: File) => void;
}

export function ResumeSection({ currentResumeUrl, onResumeChange }: ResumeSectionProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      onResumeChange(file);
      toast.success('Resume uploaded successfully!');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume</CardTitle>
        <CardDescription>Upload and manage your resume</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="hidden"
            id="resume-upload"
          />
          <Label htmlFor="resume-upload" className="cursor-pointer">
            <Button className="bg-[#52789e] hover:bg-[#6b9cc3] text-white">
              <Upload className="mr-2 h-4 w-4" />
              {resumeFile ? 'Change Resume' : 'Upload Resume'}
            </Button>
          </Label>
          {resumeFile && (
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{resumeFile.name}</span>
            </div>
          )}
        </div>
        {currentResumeUrl && !resumeFile && (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => window.open(currentResumeUrl, '_blank')}
              className="text-[#52789e] hover:text-[#6b9cc3]"
            >
              <FileText className="mr-2 h-4 w-4" />
              View Current Resume
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}