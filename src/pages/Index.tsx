
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ContentRow from '@/components/ContentRow';
import Footer from '@/components/Footer';
import { featuredMovies, trendingMovies, tvShows } from '@/data/mockData';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <Hero />
        
        <ContentRow 
          title="Featured Movies" 
          items={featuredMovies} 
          type="movie"
          slug="movies/featured"
        />
        
        <ContentRow 
          title="Trending Now" 
          items={trendingMovies} 
          type="movie"
          slug="movies/trending"
        />
        
        <ContentRow 
          title="Popular TV Shows" 
          items={tvShows} 
          type="tv"
          slug="tvshows/popular"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
