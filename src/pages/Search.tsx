
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import ContentRow from '@/components/ContentRow';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { searchMoviesAndShows } from '@/services/tmdbAPI';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchMoviesAndShows(searchQuery),
    enabled: searchQuery.length > 2,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-8">
            <Input
              type="search"
              placeholder="Search movies and TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Search for your favorite movies and TV shows to watch their trailers
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-pulse text-xl">Searching...</div>
            </div>
          ) : searchResults?.length > 0 ? (
            <ContentRow 
              title="Search Results" 
              items={searchResults}
            />
          ) : searchQuery.length > 2 && (
            <p className="text-center text-muted-foreground">
              No results found for "{searchQuery}"
            </p>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
