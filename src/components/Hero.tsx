
import React from 'react';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: 'url(https://image.tmdb.org/t/p/original/bMRofddQE58ToKM7BUjsAPdKoIi.jpg)' }}
      />
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col items-start max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-3">Dune: Part Two</h1>
        <div className="flex gap-2 text-sm text-muted-foreground mb-4">
          <span>2024</span>
          <span>•</span>
          <span>PG-13</span>
          <span>•</span>
          <span>2h 46m</span>
          <span>•</span>
          <span>Sci-Fi/Adventure</span>
        </div>
        <p className="text-base md:text-lg mb-6 max-w-2xl">
          Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" className="rounded-full gap-2">
            <Play className="h-5 w-5" />
            Play
          </Button>
          <Button variant="secondary" size="lg" className="rounded-full gap-2">
            <Info className="h-5 w-5" />
            More Info
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
