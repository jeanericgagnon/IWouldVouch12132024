import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface ContactSectionProps {
  email: string;
  phoneNumber?: string;
  showEmail: boolean;
  showPhone: boolean;
  onUpdateContact: (updates: { 
    email?: string; 
    phoneNumber?: string; 
    showEmail?: boolean; 
    showPhone?: boolean;
  }) => void;
}

const formatPhoneNumber = (value: string, countryCode: string) => {
  const phoneNumber = value.replace(/\D/g, '');
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export function ContactSection({ 
  email, 
  phoneNumber, 
  showEmail, 
  showPhone, 
  onUpdateContact 
}: ContactSectionProps) {
  const [countryCode, setCountryCode] = useState('1');
  const [phoneError, setPhoneError] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value, countryCode);
    onUpdateContact({ phoneNumber: formattedNumber });
    
    if (e.target.value && !formattedNumber.match(/^\(\d{3}\) \d{3}-\d{4}$/)) {
      setPhoneError('Please enter a valid 10-digit phone number');
    } else {
      setPhoneError('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email">Email</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateContact({ showEmail: !showEmail })}
              className="text-muted-foreground"
            >
              {showEmail ? (
                <><Eye className="h-4 w-4 mr-2" /> Public</>
              ) : (
                <><EyeOff className="h-4 w-4 mr-2" /> Private</>
              )}
            </Button>
          </div>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onUpdateContact({ email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="phone">Phone Number</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateContact({ showPhone: !showPhone })}
              className="text-muted-foreground"
            >
              {showPhone ? (
                <><Eye className="h-4 w-4 mr-2" /> Public</>
              ) : (
                <><EyeOff className="h-4 w-4 mr-2" /> Private</>
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center w-24">
              <span className="mr-1">+</span>
              <Input
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="1"
                className="w-16"
              />
            </div>
            <Input
              id="phone"
              value={phoneNumber || ''}
              onChange={handlePhoneChange}
              placeholder="(555) 123-4567"
            />
          </div>
          {phoneError && (
            <p className="text-sm text-red-500">{phoneError}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}