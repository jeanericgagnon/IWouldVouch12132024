import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface JobSearchSectionProps {
  user: {
    availability?: {
      isAvailable: boolean;
      status: string;
      workStyles?: string[];
      positionsInterestedIn?: string[];
      cities?: string[];
    };
  };
  onUpdateUser: (updates: any) => void;
}

export function JobSearchSection({ user, onUpdateUser }: JobSearchSectionProps) {
  const [isLookingForWork, setIsLookingForWork] = useState(user.availability?.isAvailable || false);
  const [workStyle, setWorkStyle] = useState<string>(user.availability?.workStyles?.[0] || '');
  const [positions, setPositions] = useState<string[]>(user.availability?.positionsInterestedIn || []);
  const [newPosition, setNewPosition] = useState('');
  const [cities, setCities] = useState<string[]>(user.availability?.cities || []);
  const [newCity, setNewCity] = useState('');

  const updateAvailability = (
    isAvailable: boolean,
    style: string,
    seekingPositions: string[],
    preferredCities: string[]
  ) => {
    onUpdateUser({
      availability: {
        isAvailable,
        status: isAvailable ? 'actively-looking' : 'not-looking',
        workStyles: style ? [style] : [],
        positionsInterestedIn: seekingPositions,
        cities: preferredCities,
      },
    });
  };

  const handleAddPosition = () => {
    if (newPosition.trim() && positions.length < 3) {
      const updatedPositions = [...positions, newPosition.trim()];
      setPositions(updatedPositions);
      setNewPosition('');
      updateAvailability(isLookingForWork, workStyle, updatedPositions, cities);
    }
  };

  const handleRemovePosition = (positionToRemove: string) => {
    const updatedPositions = positions.filter(position => position !== positionToRemove);
    setPositions(updatedPositions);
    updateAvailability(isLookingForWork, workStyle, updatedPositions, cities);
  };

  const handleAddCity = () => {
    if (newCity.trim() && cities.length < 3) {
      const updatedCities = [...cities, newCity.trim()];
      setCities(updatedCities);
      setNewCity('');
      updateAvailability(isLookingForWork, workStyle, positions, updatedCities);
    }
  };

  const handleRemoveCity = (cityToRemove: string) => {
    const updatedCities = cities.filter(city => city !== cityToRemove);
    setCities(updatedCities);
    updateAvailability(isLookingForWork, workStyle, positions, updatedCities);
  };

  return (
    <Card className={isLookingForWork ? "border-green-200 dark:border-green-800" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-xl font-semibold">Looking for Work?</h3>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${!isLookingForWork ? 'text-muted-foreground font-medium' : ''}`}>No</span>
              <Switch
                checked={isLookingForWork}
                onCheckedChange={(checked) => {
                  setIsLookingForWork(checked);
                  updateAvailability(checked, workStyle, positions, cities);
                }}
                className="data-[state=checked]:bg-green-500"
              />
              <span className={`text-sm ${isLookingForWork ? 'text-muted-foreground font-medium' : ''}`}>Yes</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {isLookingForWork && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Work Style Preference</Label>
            <Select 
              value={workStyle} 
              onValueChange={(value) => {
                setWorkStyle(value);
                updateAvailability(isLookingForWork, value, positions, cities);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select work style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inPerson">In Person</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(workStyle === 'inPerson' || workStyle === 'hybrid') && (
            <div className="space-y-2">
              <Label>Preferred Cities ({cities.length}/3)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {cities.map((city) => (
                  <Badge key={city} variant="secondary">
                    {city}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCity(city)}
                      className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              {cities.length < 3 && (
                <div className="flex gap-2">
                  <Input
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Enter city (e.g., San Francisco, CA)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCity();
                      }
                    }}
                  />
                  <Button onClick={handleAddCity}>Add</Button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Positions Interested In ({positions.length}/3)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {positions.map((position) => (
                <Badge key={position} variant="secondary">
                  {position}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePosition(position)}
                    className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            {positions.length < 3 && (
              <div className="flex gap-2">
                <Input
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  placeholder="Enter position (e.g., Software Engineer)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPosition();
                    }
                  }}
                />
                <Button onClick={handleAddPosition}>Add</Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}