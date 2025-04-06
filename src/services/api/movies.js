// Movie-related TMDB API services

import { BASE_URL, options } from './config';
import { genreIdMapping } from '../../lib/genres';

// Get trending movies
export const getTrendingMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week`, options);
    const data = await response.json();
    return data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      year: movie.release_date ? movie.release_date.substring(0, 4) : "",
      type: "movie"
    }));
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};

// Get featured movies (popular movies)
export const getFeaturedMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular`, options);
    const data = await response.json();
    return data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      year: movie.release_date ? movie.release_date.substring(0, 4) : "",
      type: "movie"
    }));
  } catch (error) {
    console.error("Error fetching featured movies:", error);
    return [];
  }
};

// Get top rated movies (top 10)
export const getTopRatedMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/top_rated`, options);
    const data = await response.json();
    return data.results.slice(0, 10).map(movie => ({
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      year: movie.release_date ? movie.release_date.substring(0, 4) : "",
      type: "movie"
    }));
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    return [];
  }
};

// Get movie details
export const getMovieDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}`, options);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    return null;
  }
};

// Get movie for hero (latest popular movie)
export const getHeroMovie = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/now_playing`, options);
    const data = await response.json();
    const heroMovie = data.results[0]; // Get the first movie
    
    // Get more details
    const details = await getMovieDetails(heroMovie.id);
    
    return {
      id: heroMovie.id,
      title: heroMovie.title,
      overview: heroMovie.overview,
      backdropPath: heroMovie.backdrop_path,
      posterPath: heroMovie.poster_path,
      releaseDate: heroMovie.release_date,
      runtime: details?.runtime || 0,
      genres: details?.genres || []
    };
  } catch (error) {
    console.error("Error fetching hero movie:", error);
    return null;
  }
};

// Get movie trailers
export const getMovieTrailers = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos`, options);
    const data = await response.json();
    
    // Filter for trailers and teasers
    const videos = data.results.filter(video => 
      video.type === 'Trailer' || video.type === 'Teaser'
    );
    
    return videos;
  } catch (error) {
    console.error(`Error fetching trailers for movie ID ${movieId}:`, error);
    return [];
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreSlug) => {
  try {
    const genreId = genreIdMapping[genreSlug];
    
    if (!genreId) {
      console.error(`No matching genre ID found for slug: ${genreSlug}`);
      return [];
    }
    
    const response = await fetch(
      `${BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`,
      options
    );
    const data = await response.json();
    
    return data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      year: movie.release_date ? movie.release_date.substring(0, 4) : "",
      type: "movie"
    }));
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreSlug}:`, error);
    return [];
  }
};

// Get best movies of all time (custom selection)
export const getBestMoviesOfAllTime = async () => {
  // These are the specific movie IDs we want to fetch
  // 1. Avengers Endgame, 2. Avengers Infinity War, 3. Black Panther, 
  // 4. Parmanu, 5. Dil Bechara, 6. Kalki 2898AD, 7. Spider-Man: No Way Home, 
  // 8. Top Gun: Maverick, 9. Wonder Woman 1984
  const movieIds = [
    299534, // Avengers: Endgame
    299536, // Avengers: Infinity War
    284054, // Black Panther
    532459, // Parmanu: The Story of Pokhran
    610201, // Dil Bechara
    1023094, // Kalki 2898 AD
    634649, // Spider-Man: No Way Home
    361743, // Top Gun: Maverick
    464052  // Wonder Woman 1984
  ];

  // Direct video file links for each movie - use the embed URL format
  const directVideoLinks = {
    299534: "https://drive.google.com/file/d/1TdGi8PzgUZ1RNFw5NnNr2MnqVeIVN4SK/preview?usp=sharing", // Avengers: Endgame
    299536: "https://drive.google.com/file/d/1fcKRBIYJ2HE2uCN2N8KGJzhgtvC0LdZH/preview?usp=sharing", // Avengers: Infinity War
    284054: "https://drive.google.com/file/d/1CYE6ArOpKtsFJIlXa0ivCGfQH5XiLsvs/preview?usp=sharing", // Black Panther
    532459: "https://drive.google.com/file/d/1KsSn9FeXUXLuiQJRfcXxVdg8bGK8GDEs/preview?usp=sharing", // Parmanu
    610201: "https://drive.google.com/file/d/1nINviDRCZQF3J8ekXB0JCwQvODYzgKEX/preview?usp=sharing", // Dil Bechara
    1023094: "https://drive.google.com/file/d/1LWl9f3CrTngisG0vtI6LQHc22oAcmwDj/preview?usp=sharing", // Kalki
    634649: "https://drive.google.com/file/d/1P5ZrCGvS2Kb28jA3m2l3ERuaj4xDWJID/preview?usp=sharing", // Spider-Man: No Way Home
    361743: "https://drive.google.com/file/d/1efSDF3lqIb0y4L7IJwpelC-w7Er9SXWF/preview?usp=sharing", // Top Gun: Maverick
    464052: "https://drive.google.com/file/d/1Flc70JE-HaW-oROhzUahZLlFn3wmoKEA/preview?usp=sharing"  // Wonder Woman 1984
  };

  try {
    // We'll fetch each movie separately and combine them
    const moviesPromises = movieIds.map(id => 
      fetch(`${BASE_URL}/movie/${id}`, options)
        .then(response => response.json())
        .then(movie => ({
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          year: movie.release_date ? movie.release_date.substring(0, 4) : "",
          type: "movie",
          watchLink: directVideoLinks[movie.id] // Add the direct video file link
        }))
    );
    
    const movies = await Promise.all(moviesPromises);
    return movies;
  } catch (error) {
    console.error("Error fetching best movies of all time:", error);
    return [];
  }
};
