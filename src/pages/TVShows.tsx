
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ContentRow from '@/components/ContentRow';
import Footer from '@/components/Footer';
import { getPopularTVShows } from '@/services/tmdbAPI';
import { toast } from 'sonner';

const TVShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const shows = await getPopularTVShows();
        setTvShows(shows);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
        toast.error("Failed to load TV shows. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">TV Shows</h1>
          
          {loading ? (
            <div className="container px-4 mx-auto py-20 flex justify-center">
              <div className="animate-pulse text-xl">Loading TV shows...</div>
            </div>
          ) : (
            <ContentRow 
              title="Popular TV Shows" 
              items={tvShows} 
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
