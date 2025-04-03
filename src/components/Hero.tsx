
import React, { useState, useEffect } from 'react';
import { Play, Info, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Link } from 'react-router-dom';
import { getHeroMovie } from '@/services/tmdbAPI';
import { getMovieByTitle } from '@/services/omdbAPI';
import { trackWatchMovie } from '@/services/userBehaviorService';

const Hero = () => {
  const [heroData, setHeroData] = useState(null);
  const [omdbMovie, setOmdbMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieOpen, setMovieOpen] = useState(false);

  // Mock user ID - in a real app, you would get this from authentication
  const mockUserId = "user123";

  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        setLoading(true);
        const movie = await getHeroMovie();
        setHeroData(movie);
        
        // Try to fetch the movie from OMDB using the title and year
        if (movie) {
          const year = movie.releaseDate ? movie.releaseDate.substring(0, 4) : "";
          const omdbData = await getMovieByTitle(movie.title, year);
          setOmdbMovie(omdbData);
        }
      } catch (error) {
        console.error("Error fetching hero movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroMovie();
  }, []);

  const handleWatchMovie = () => {
    setMovieOpen(true);
    
    // Track that the user watched the full movie
    if (heroData) {
      trackWatchMovie(mockUserId, heroData.id, heroData.title);
    }
  };

  // Check if movie is available to watch (exists in both TMDB and OMDB)
  const isMovieAvailable = omdbMovie && omdbMovie.imdbID;

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
          {omdbMovie && omdbMovie.imdbRating && (
            <>
              <span>•</span>
              <span>IMDb: {omdbMovie.imdbRating}</span>
            </>
          )}
        </div>
        <p className="text-base md:text-lg mb-6 max-w-2xl">
          {heroData.overview}
        </p>
        <div className="flex flex-wrap gap-4">
          {isMovieAvailable ? (
            <Dialog open={movieOpen} onOpenChange={setMovieOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="rounded-full gap-2"
                  onClick={handleWatchMovie}
                >
                  <Play className="h-5 w-5" />
                  Watch Now
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 bg-black">
                <div className="aspect-video w-full flex items-center justify-center bg-black p-8 text-center">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-white">
                      {heroData.title} is now playing
                    </h3>
                    <p className="text-gray-300 mb-4">
                      This is a simulation. In a real streaming app, the movie would play here.
                    </p>
                    <p className="text-sm text-gray-400">
                      IMDb ID: {omdbMovie?.imdbID}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button size="lg" className="rounded-full gap-2">
              <Play className="h-5 w-5" />
              Play
            </Button>
          )}
          <Link to={`/movie/${heroData.id}`}>
            <Button variant="secondary" size="lg" className="rounded-full gap-2">
              <Info className="h-5 w-5" />
              More Info
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
