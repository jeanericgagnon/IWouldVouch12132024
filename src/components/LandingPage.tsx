import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { Linkedin, ChevronLeft, ChevronRight, Award, Users, TrendingUp } from 'lucide-react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface DailyEndorsement {
  id: number;
  content: string;
  author: string;
  position: string;
  image: string;
}

const mockDailyEndorsements: DailyEndorsement[] = [
  {
    id: 1,
    content: "Sarah's project management skills are exceptional. She consistently delivers results on time and within budget.",
    author: "John Smith",
    position: "Senior Director, TechCorp",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    id: 2,
    content: "David's innovative approach to problem-solving has transformed our development process. He's a true asset to any team.",
    author: "Emily Chen",
    position: "CTO, InnovateNow",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop"
  },
  {
    id: 3,
    content: "Lisa's leadership during our recent product launch was outstanding. Her strategic vision and ability to motivate the team were key to our success.",
    author: "Michael Johnson",
    position: "VP of Marketing, BrandBuilders",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop"
  }
];

function fetchDailyEndorsements(): Promise<DailyEndorsement[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDailyEndorsements);
    }, 1000);
  });
}

export function LandingPage() {
  const navigate = useNavigate();
  const [dailyEndorsements, setDailyEndorsements] = useState<DailyEndorsement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    let isMounted = true;
    fetchDailyEndorsements()
      .then(data => {
        if (isMounted) {
          setDailyEndorsements(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('Error fetching daily endorsements:', err);
          setError('Failed to load endorsements. Please try again later.');
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (emblaApi) {
      const autoplay = setInterval(() => {
        emblaApi.scrollNext();
      }, 5000);

      return () => {
        clearInterval(autoplay);
      };
    }
  }, [emblaApi]);

  const endorsementCards = useMemo(() => dailyEndorsements.map((endorsement) => (
    <div key={endorsement.id} className="flex-[0_0_100%] min-w-0 px-2 sm:flex-[0_0_50%] md:flex-[0_0_calc(33.33%-0.67rem)]">
      <Card className="h-full transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.02] cursor-pointer border border-border group">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex-grow overflow-hidden">
            <p className="text-lg mb-4 line-clamp-4">"{endorsement.content}"</p>
          </div>
          <div className="flex items-center mt-4">
            <img
              src={endorsement.image}
              alt={endorsement.author}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div>
              <p className="font-semibold">{endorsement.author}</p>
              <p className="text-sm text-muted-foreground">{endorsement.position}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )), [dailyEndorsements]);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-8 [&>section]:relative [&>section]:z-10">
        <section className="container mx-auto px-4 py-12 text-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/[0.03] before:to-transparent before:-z-10">
          <h1 className="text-4xl font-bold mb-4">Empower Your Career with Trusted Endorsements</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Showcase your achievements and collect endorsements from colleagues, clients, and partners.
          </p>
          <Button 
            size="lg" 
            className="transition-all duration-200 ease-in-out bg-[#52789e] hover:bg-[#6b9cc3] hover:scale-105"
            onClick={() => navigate('/signup')}
          >
            <Linkedin className="mr-2 h-5 w-5" />
            Create Your Profile with LinkedIn
          </Button>
        </section>

        <section className="container mx-auto px-4 py-12 before:absolute before:inset-0 before:bg-gradient-to-t before:from-primary/[0.02] before:to-transparent before:-z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                We're focused on building trusted and verified references through a platform where every endorsement comes from professionals who bring accountability and credibility you can rely on.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex flex-col items-center max-w-[200px]">
                  <Award className="w-10 h-10 text-primary mb-2" />
                  <p><strong className="text-foreground">Recognition</strong> for your true potential</p>
                </div>
                <div className="flex flex-col items-center max-w-[200px]">
                  <Users className="w-10 h-10 text-primary mb-2" />
                  <p><strong className="text-foreground">Trust</strong> from authentic endorsements</p>
                </div>
                <div className="flex flex-col items-center max-w-[200px]">
                  <TrendingUp className="w-10 h-10 text-primary mb-2" />
                  <p><strong className="text-foreground">Grow</strong> your resume with verified referrals</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/[0.03] before:to-transparent before:-z-10">
          <h2 className="text-2xl font-semibold mb-6 text-center">Today's Top Endorsements</h2>
          {isLoading ? (
            <p className="text-center">Loading today's endorsements...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="relative max-w-full overflow-hidden px-8">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {endorsementCards}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full z-10 bg-background/80 backdrop-blur-sm"
                onClick={scrollPrev}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous endorsement</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full z-10 bg-background/80 backdrop-blur-sm"
                onClick={scrollNext}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next endorsement</span>
              </Button>
            </div>
          )}
        </section>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground bg-gradient-to-t from-primary/[0.02] to-transparent">
        © 2024 IWouldVouch. All rights reserved.
      </footer>
    </div>
  );
}