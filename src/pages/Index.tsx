
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ContentRow from '@/components/ContentRow';
import Footer from '@/components/Footer';
import { 
  getTrendingMovies, 
  getFeaturedMovies, 
  getPopularTVShows, 
  getTopRatedMovies,
  getTopRatedTVShows
} from '@/services/tmdbAPI';
import { toast } from 'sonner';

const Index = () => {
  const { data: featuredMovies, isLoading: featuredLoading, error: featuredError } = useQuery({
    queryKey: ['featuredMovies'],
    queryFn: getFeaturedMovies,
    meta: {
      onError: (error) => {
        console.error("Error fetching featured movies:", error);
        toast.error("Failed to load featured movies.");
      }
    }
  });

  const { data: trendingMovies, isLoading: trendingLoading, error: trendingError } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: getTrendingMovies,
    meta: {
      onError: (error) => {
        console.error("Error fetching trending movies:", error);
        toast.error("Failed to load trending movies.");
      }
    }
  });

  const { data: popularTVShows, isLoading: tvShowsLoading, error: tvShowsError } = useQuery({
    queryKey: ['popularTVShows'],
    queryFn: getPopularTVShows,
    meta: {
      onError: (error) => {
        console.error("Error fetching TV shows:", error);
        toast.error("Failed to load TV shows.");
      }
    }
  });

  const { data: topRatedMovies, isLoading: topMoviesLoading, error: topMoviesError } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: getTopRatedMovies,
    meta: {
      onError: (error) => {
        console.error("Error fetching top rated movies:", error);
        toast.error("Failed to load top rated movies.");
      }
    }
  });

  const { data: topRatedTVShows, isLoading: topTVShowsLoading, error: topTVShowsError } = useQuery({
    queryKey: ['topRatedTVShows'],
    queryFn: getTopRatedTVShows,
    meta: {
      onError: (error) => {
        console.error("Error fetching top rated TV shows:", error);
        toast.error("Failed to load top rated TV shows.");
      }
    }
  });

  const isLoading = featuredLoading || trendingLoading || tvShowsLoading || 
                    topMoviesLoading || topTVShowsLoading;
  
  const hasError = featuredError || trendingError || tvShowsError || 
                  topMoviesError || topTVShowsError;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <Hero />
        
        {isLoading ? (
          <div className="container px-4 mx-auto py-20 flex justify-center">
            <div className="animate-pulse text-xl">Loading content...</div>
          </div>
        ) : hasError ? (
          <div className="text-center py-10">
            <p className="text-lg text-red-500">Failed to load some content</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <ContentRow 
              title="Featured Movies" 
              items={featuredMovies || []} 
              type="movie"
              slug="movies/featured"
            />
            
            <ContentRow 
              title="Trending Movies" 
              items={trendingMovies || []} 
              type="movie"
              slug="movies/trending"
            />
            
            <ContentRow 
              title="Top 10 Movies" 
              items={topRatedMovies || []} 
              type="movie"
              slug="movies/top-rated"
            />
            
            <ContentRow 
              title="Popular TV Shows" 
              items={popularTVShows || []} 
              type="tv"
              slug="tvshows/popular"
            />
            
            <ContentRow 
              title="Top 10 TV Shows" 
              items={topRatedTVShows || []} 
              type="tv"
              slug="tvshows/top-rated"
            />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
