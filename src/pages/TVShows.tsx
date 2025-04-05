
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import ContentRow from '@/components/ContentRow';
import Footer from '@/components/Footer';
import { getPopularTVShows, getTopRatedTVShows } from '@/services/tmdbAPI';
import { toast } from 'sonner';

const TVShows = () => {
  const { data: popularTVShows, isLoading: popularLoading, error: popularError } = useQuery({
    queryKey: ['popularTVShows'],
    queryFn: getPopularTVShows,
    meta: {
      onError: (error) => {
        console.error("Error fetching popular TV shows:", error);
        toast.error("Failed to load popular TV shows. Please try again later.");
      }
    }
  });

  const { data: topRatedTVShows, isLoading: topRatedLoading, error: topRatedError } = useQuery({
    queryKey: ['topRatedTVShows'],
    queryFn: getTopRatedTVShows,
    meta: {
      onError: (error) => {
        console.error("Error fetching top rated TV shows:", error);
        toast.error("Failed to load top rated TV shows. Please try again later.");
      }
    }
  });

  const isLoading = popularLoading || topRatedLoading;
  const hasError = popularError || topRatedError;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">TV Shows</h1>
          
          {isLoading ? (
            <div className="container px-4 mx-auto py-20 flex justify-center">
              <div className="animate-pulse text-xl">Loading TV shows...</div>
            </div>
          ) : hasError ? (
            <div className="text-center py-10">
              <p className="text-lg text-red-500">Failed to load TV shows</p>
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
                title="Popular TV Shows" 
                items={Array.isArray(popularTVShows) ? popularTVShows : []} 
                type="tv"
              />
              <ContentRow 
                title="Top Rated TV Shows" 
                items={Array.isArray(topRatedTVShows) ? topRatedTVShows : []} 
                type="tv"
              />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TVShows;
