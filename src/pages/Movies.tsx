
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import ContentRow from '@/components/ContentRow';
import Footer from '@/components/Footer';
import { getFeaturedMovies, getTrendingMovies, getTopRatedMovies } from '@/services/tmdbAPI';
import { toast } from 'sonner';

const Movies = () => {
  const { data: featuredMovies, isLoading: featuredLoading, error: featuredError } = useQuery({
    queryKey: ['featuredMovies'],
    queryFn: getFeaturedMovies,
    meta: {
      onError: (error) => {
        console.error("Error fetching featured movies:", error);
        toast.error("Failed to load featured movies. Please try again later.");
      }
    }
  });

  const { data: trendingMovies, isLoading: trendingLoading, error: trendingError } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: getTrendingMovies,
    meta: {
      onError: (error) => {
        console.error("Error fetching trending movies:", error);
        toast.error("Failed to load trending movies. Please try again later.");
      }
    }
  });

  const { data: topRatedMovies, isLoading: topRatedLoading, error: topRatedError } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: getTopRatedMovies,
    meta: {
      onError: (error) => {
        console.error("Error fetching top rated movies:", error);
        toast.error("Failed to load top rated movies. Please try again later.");
      }
    }
  });

  const isLoading = featuredLoading || trendingLoading || topRatedLoading;
  const hasError = featuredError || trendingError || topRatedError;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Movies</h1>
          
          {isLoading ? (
            <div className="container px-4 mx-auto py-20 flex justify-center">
              <div className="animate-pulse text-xl">Loading movies...</div>
            </div>
          ) : hasError ? (
            <div className="text-center py-10">
              <p className="text-lg text-red-500">Failed to load movies</p>
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
                items={Array.isArray(featuredMovies) ? featuredMovies : []} 
                type="movie"
              />
              
              <ContentRow 
                title="Trending Now" 
                items={Array.isArray(trendingMovies) ? trendingMovies : []} 
                type="movie"
              />
              
              <ContentRow 
                title="Top 10 Movies" 
                items={Array.isArray(topRatedMovies) ? topRatedMovies : []} 
                type="movie"
              />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Movies;
