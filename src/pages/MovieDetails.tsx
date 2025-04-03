
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus, ThumbsUp, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMovieDetails, getMovieTrailers } from '@/services/tmdbAPI';
import { getMovieByTitle, getWatchUrl } from '@/services/omdbAPI';
import { trackMovieView, trackTrailerView, trackWatchMovie } from '@/services/userBehaviorService';
import { toast } from 'sonner';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [omdbMovie, setOmdbMovie] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [movieOpen, setMovieOpen] = useState(false);

  // Mock user ID - in a real app, you would get this from authentication
  const mockUserId = "user123";
  const flixFoxUrl = getWatchUrl();

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
        
        // Track that the user viewed this movie
        if (data) {
          trackMovieView(mockUserId, data.id, data.title);
          
          // Try to fetch the movie from OMDB using the title and year
          const year = data.release_date ? data.release_date.substring(0, 4) : "";
          const omdbData = await getMovieByTitle(data.title, year);
          setOmdbMovie(omdbData);
        }
        
        // Fetch trailers
        const trailerData = await getMovieTrailers(id);
        setTrailers(trailerData);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        toast.error("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handlePlayTrailer = (trailer) => {
    setSelectedTrailer(trailer);
    setTrailerOpen(true);
    
    // Track that the user watched a trailer
    if (movie) {
      trackTrailerView(mockUserId, movie.id, movie.title);
    }
  };

  const handleWatchMovie = () => {
    // Track that the user watched the full movie
    if (movie) {
      trackWatchMovie(mockUserId, movie.id, movie.title);
    }
    
    // Redirect to FlixFox
    window.open(flixFoxUrl, '_blank');
  };

  // Check if movie is available to watch
  const isMovieAvailable = true; // We're assuming all movies are available via FlixFox

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-10 container mx-auto px-4 flex justify-center">
          <div className="animate-pulse text-xl">Loading movie details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-10 container mx-auto px-4 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
    
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : "";
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "";
  const genres = movie.genres?.map(g => g.name).join(', ');

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
        
        {/* Movie details */}
        <div className={`container mx-auto px-4 ${backdropUrl ? '-mt-32 relative z-10' : 'mt-8'}`}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <img 
                src={posterUrl} 
                alt={movie.title} 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            
            {/* Info */}
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-4">
                {releaseYear && <span>{releaseYear}</span>}
                {runtime && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{runtime}</span>
                  </>
                )}
                {genres && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{genres}</span>
                  </>
                )}
                {movie.vote_average && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" /> {movie.vote_average.toFixed(1)}
                    </span>
                  </>
                )}
                {omdbMovie && omdbMovie.imdbRating && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="flex items-center gap-1">
                      IMDb: {omdbMovie.imdbRating}
                    </span>
                  </>
                )}
              </div>
              
              {movie.tagline && (
                <p className="text-lg italic text-muted-foreground mb-4">{movie.tagline}</p>
              )}
              
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="mb-6">{movie.overview}</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                {trailers.length > 0 ? (
                  <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="lg" 
                        className="rounded-full gap-2"
                        onClick={() => handlePlayTrailer(trailers[0])}
                      >
                        <Play className="h-5 w-5" />
                        Watch Trailer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0 bg-black">
                      <DialogTitle className="sr-only">Trailer for {movie.title}</DialogTitle>
                      <DialogDescription className="sr-only">Watch the trailer for {movie.title}</DialogDescription>
                      {selectedTrailer && (
                        <div className="aspect-video w-full">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${selectedTrailer.key}?autoplay=1`}
                            title={selectedTrailer.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button size="lg" className="rounded-full gap-2" disabled>
                    <Play className="h-5 w-5" />
                    No Trailers Available
                  </Button>
                )}
                
                {isMovieAvailable && (
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="rounded-full gap-2"
                    onClick={handleWatchMovie}
                  >
                    <Film className="h-5 w-5" />
                    Watch Movie
                  </Button>
                )}
              </div>
              
              {/* Additional info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movie.production_companies?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Production</h3>
                    <p>{movie.production_companies.map(c => c.name).join(', ')}</p>
                  </div>
                )}
                
                {movie.spoken_languages?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Languages</h3>
                    <p>{movie.spoken_languages.map(l => l.english_name).join(', ')}</p>
                  </div>
                )}
                
                {omdbMovie && omdbMovie.Director && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Director</h3>
                    <p>{omdbMovie.Director}</p>
                  </div>
                )}
                
                {omdbMovie && omdbMovie.Actors && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Cast</h3>
                    <p>{omdbMovie.Actors}</p>
                  </div>
                )}
              </div>
              
              {/* Trailers section */}
              {trailers.length > 1 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Trailers & Teasers</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trailers.map((trailer) => (
                      <Dialog key={trailer.id}>
                        <DialogTrigger asChild>
                          <div 
                            className="cursor-pointer relative aspect-video bg-gray-900 rounded-lg overflow-hidden"
                            onClick={() => handlePlayTrailer(trailer)}
                          >
                            <img 
                              src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`} 
                              alt={trailer.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="h-12 w-12 text-white" />
                            </div>
                            <p className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-sm truncate">
                              {trailer.name}
                            </p>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl p-0 bg-black">
                          <DialogTitle className="sr-only">Trailer: {trailer.name}</DialogTitle>
                          <DialogDescription className="sr-only">Watch the trailer for {movie.title}</DialogDescription>
                          <div className="aspect-video w-full">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                              title={trailer.name}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </DialogContent>
                      </Dialog>
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

export default MovieDetails;
