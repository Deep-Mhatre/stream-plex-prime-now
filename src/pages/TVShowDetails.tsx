
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus, ThumbsUp, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getTVShowDetails } from '@/services/tmdbAPI';
import { getTVShowByTitle } from '@/services/omdbAPI';
import { trackWatchTVShow } from '@/services/userBehaviorService';
import { toast } from 'sonner';

const TVShowDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [omdbShow, setOmdbShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOpen, setShowOpen] = useState(false);

  // Mock user ID - in a real app, you would get this from authentication
  const mockUserId = "user123";

  useEffect(() => {
    const fetchTVShow = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getTVShowDetails(id);
        setShow(data);
        
        // Try to fetch the TV show from OMDB using the title and year
        if (data) {
          const year = data.first_air_date ? data.first_air_date.substring(0, 4) : "";
          const omdbData = await getTVShowByTitle(data.name, year);
          setOmdbShow(omdbData);
        }
      } catch (error) {
        console.error("Error fetching TV show details:", error);
        toast.error("Failed to load TV show details");
      } finally {
        setLoading(false);
      }
    };

    fetchTVShow();
  }, [id]);

  const handleWatchShow = () => {
    setShowOpen(true);
    
    // Track that the user watched the TV show
    if (show) {
      trackWatchTVShow(mockUserId, show.id, show.name);
    }
  };

  // Check if show is available to watch (exists in both TMDB and OMDB)
  const isShowAvailable = omdbShow && omdbShow.imdbID;

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
                {omdbShow && omdbShow.imdbRating && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="flex items-center gap-1">
                      IMDb: {omdbShow.imdbRating}
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
                {isShowAvailable ? (
                  <Dialog open={showOpen} onOpenChange={setShowOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="lg" 
                        className="rounded-full gap-2"
                        onClick={handleWatchShow}
                      >
                        <Play className="h-5 w-5" />
                        Watch Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0 bg-black">
                      <div className="aspect-video w-full flex items-center justify-center bg-black p-8 text-center">
                        <div>
                          <h3 className="text-xl font-bold mb-4 text-white">
                            {show.name} is now playing
                          </h3>
                          <p className="text-gray-300 mb-4">
                            This is a simulation. In a real streaming app, the TV show would play here.
                          </p>
                          <p className="text-sm text-gray-400">
                            IMDb ID: {omdbShow?.imdbID}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button size="lg" className="rounded-full gap-2" disabled>
                    <Play className="h-5 w-5" />
                    Not Available
                  </Button>
                )}
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
                
                {omdbShow && omdbShow.Writer && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Writers</h3>
                    <p>{omdbShow.Writer}</p>
                  </div>
                )}
                
                {omdbShow && omdbShow.Actors && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Cast</h3>
                    <p>{omdbShow.Actors}</p>
                  </div>
                )}
              </div>
              
              {/* Seasons section if we wanted to add that */}
              {show.seasons && show.seasons.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Seasons</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {show.seasons.map((season) => (
                      <div key={season.id} className="bg-card rounded-lg overflow-hidden shadow">
                        <div className="aspect-[2/3] bg-secondary">
                          {season.poster_path ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w300${season.poster_path}`} 
                              alt={season.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                              <span>No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{season.name}</h3>
                          <p className="text-sm text-muted-foreground">{season.episode_count} Episodes</p>
                          {season.air_date && (
                            <p className="text-sm text-muted-foreground">{new Date(season.air_date).getFullYear()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TVShowDetails;
