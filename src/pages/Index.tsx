
import React, { useState, useEffect } from 'react';
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
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topTVShows, setTopTVShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featured, trending, shows, topRatedMovies, topRatedShows] = await Promise.all([
          getFeaturedMovies(),
          getTrendingMovies(),
          getPopularTVShows(),
          getTopRatedMovies(),
          getTopRatedTVShows()
        ]);
        
        setFeaturedMovies(featured);
        setTrendingMovies(trending);
        setTvShows(shows);
        setTopMovies(topRatedMovies);
        setTopTVShows(topRatedShows);
      } catch (error) {
        console.error("Error fetching content:", error);
        toast.error("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <Hero />
        
        {loading ? (
          <div className="container px-4 mx-auto py-20 flex justify-center">
            <div className="animate-pulse text-xl">Loading content...</div>
          </div>
        ) : (
          <>
            <ContentRow 
              title="Featured Movies" 
              items={featuredMovies} 
              type="movie"
              slug="movies/featured"
            />
            
            <ContentRow 
              title="Trending Movies" 
              items={trendingMovies} 
              type="movie"
              slug="movies/trending"
            />
            
            <ContentRow 
              title="Top 10 Movies" 
              items={topMovies} 
              type="movie"
              slug="movies/top-rated"
            />
            
            <ContentRow 
              title="Popular TV Shows" 
              items={tvShows} 
              type="tv"
              slug="tvshows/popular"
            />
            
            <ContentRow 
              title="Top 10 TV Shows" 
              items={topTVShows} 
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
