
import React, { useState, useEffect } from 'react';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHeroMovie } from '@/services/tmdbAPI';

const Hero = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        setLoading(true);
        const movie = await getHeroMovie();
        setHeroData(movie);
      } catch (error) {
        console.error("Error fetching hero movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroMovie();
  }, []);

  if (loading) {
    return (
      <div className="relative h-[70vh] md:h-[80vh] bg-slate-900 animate-pulse flex items-center justify-center">
        <div className="text-xl">Loading featured content...</div>
      </div>
    );
  }

  if (!heroData) {
    return (
      <div className="relative h-[70vh] md:h-[80vh] bg-slate-900 flex items-center justify-center">
        <div className="text-xl">Failed to load featured content</div>
      </div>
    );
  }

  const imageUrl = `https://image.tmdb.org/t/p/original${heroData.backdropPath}`;
  const releaseYear = heroData.releaseDate ? heroData.releaseDate.substring(0, 4) : "";
  const runtime = heroData.runtime ? `${Math.floor(heroData.runtime / 60)}h ${heroData.runtime % 60}m` : "";
  const genreText = heroData.genres?.map(g => g.name).join('/');

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col items-start max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-3">{heroData.title}</h1>
        <div className="flex gap-2 text-sm text-muted-foreground mb-4">
          <span>{releaseYear}</span>
          {runtime && (
            <>
              <span>•</span>
              <span>{runtime}</span>
            </>
          )}
          {genreText && (
            <>
              <span>•</span>
              <span>{genreText}</span>
            </>
          )}
        </div>
        <p className="text-base md:text-lg mb-6 max-w-2xl">
          {heroData.overview}
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
