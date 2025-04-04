
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ContentRow from '@/components/ContentRow';
import Footer from '@/components/Footer';
import { getFeaturedMovies, getTrendingMovies, getTopRatedMovies } from '@/services/tmdbAPI';
import { toast } from 'sonner';

const Movies = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featured, trending, topRated] = await Promise.all([
          getFeaturedMovies(),
          getTrendingMovies(),
          getTopRatedMovies()
        ]);
        
        setFeaturedMovies(featured);
        setTrendingMovies(trending);
        setTopMovies(topRated);
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast.error("Failed to load movies. Please try again later.");
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
          <h1 className="text-3xl font-bold mb-8">Movies</h1>
          
          {loading ? (
            <div className="container px-4 mx-auto py-20 flex justify-center">
              <div className="animate-pulse text-xl">Loading movies...</div>
            </div>
          ) : (
            <>
              <ContentRow 
                title="Featured Movies" 
                items={featuredMovies} 
                type="movie"
              />
              
              <ContentRow 
                title="Trending Now" 
                items={trendingMovies} 
                type="movie"
              />
              
              <ContentRow 
                title="Top 10 Movies" 
                items={topMovies} 
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
