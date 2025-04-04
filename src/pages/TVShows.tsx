
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import ContentRow from '@/components/ContentRow';
import Footer from '@/components/Footer';
import { getPopularTVShows } from '@/services/tmdbAPI';
import { toast } from 'sonner';

const TVShows = () => {
  const { data: tvShows, isLoading, error } = useQuery({
    queryKey: ['popularTVShows'],
    queryFn: getPopularTVShows,
    onError: (error) => {
      console.error("Error fetching TV shows:", error);
      toast.error("Failed to load TV shows. Please try again later.");
    }
  });

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
          ) : error ? (
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
            <ContentRow 
              title="Popular TV Shows" 
              items={tvShows || []} 
              type="tv"
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TVShows;
