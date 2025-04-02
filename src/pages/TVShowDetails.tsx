
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getTVShowDetails } from '@/services/tmdbAPI';
import { toast } from '@/components/ui/sonner';

const TVShowDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTVShow = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getTVShowDetails(id);
        setShow(data);
      } catch (error) {
        console.error("Error fetching TV show details:", error);
        toast.error("Failed to load TV show details");
      } finally {
        setLoading(false);
      }
    };

    fetchTVShow();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-10 container mx-auto px-4 flex justify-center">
          <div className="animate-pulse text-xl">Loading TV show details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-10 container mx-auto px-4 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">TV Show Not Found</h1>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const backdropUrl = show.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
    : null;
    
  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const firstAirYear = show.first_air_date ? show.first_air_date.substring(0, 4) : "";
  const lastAirYear = show.last_air_date && show.status === "Ended" 
    ? show.last_air_date.substring(0, 4) 
    : "Present";
  const yearRange = firstAirYear ? `${firstAirYear} - ${lastAirYear}` : "";
  
  const genres = show.genres?.map(g => g.name).join(', ');
  const creators = show.created_by?.map(c => c.name).join(', ');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        {/* Back button */}
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center text-sm hover:text-primary">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Home
          </Link>
        </div>
        
        {/* Hero backdrop */}
        {backdropUrl && (
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url(${backdropUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
        )}
        
        {/* Show details */}
        <div className={`container mx-auto px-4 ${backdropUrl ? '-mt-32 relative z-10' : 'mt-8'}`}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <img 
                src={posterUrl} 
                alt={show.name} 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            
            {/* Info */}
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{show.name}</h1>
              
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-4">
                {yearRange && <span>{yearRange}</span>}
                {show.number_of_seasons && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{show.number_of_seasons} {show.number_of_seasons === 1 ? 'Season' : 'Seasons'}</span>
                  </>
                )}
                {genres && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{genres}</span>
                  </>
                )}
                {show.vote_average && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" /> {show.vote_average.toFixed(1)}
                    </span>
                  </>
                )}
              </div>
              
              {show.tagline && (
                <p className="text-lg italic text-muted-foreground mb-4">{show.tagline}</p>
              )}
              
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="mb-6">{show.overview}</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Button size="lg" className="rounded-full gap-2">
                  <Play className="h-5 w-5" />
                  Play
                </Button>
                <Button variant="secondary" size="lg" className="rounded-full gap-2">
                  <Plus className="h-5 w-5" />
                  Add to Watchlist
                </Button>
              </div>
              
              {/* Additional info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {creators && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Created by</h3>
                    <p>{creators}</p>
                  </div>
                )}
                
                {show.networks?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Networks</h3>
                    <p>{show.networks.map(n => n.name).join(', ')}</p>
                  </div>
                )}
                
                {show.spoken_languages?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Languages</h3>
                    <p>{show.spoken_languages.map(l => l.english_name).join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TVShowDetails;
