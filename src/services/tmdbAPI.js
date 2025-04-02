// TMDB API service to fetch movies and TV shows

const API_KEY = "6c61a48574a84ca84082b3cc6849140"; // Your TMDB API key
const BASE_URL = "https://api.themoviedb.org/3";

// Headers for fetch requests
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YzYxYTQ4NDU3NGE4NGNhODQwODJiM2NjNjg0OTE0MCIsIm5iZiI6MTczOTAyNjEzOS41NTUsInN1YiI6IjY3YTc2ZWRiZGNmNzVhZmJlMmYxMGY3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NZ7j6cUan7jO8BJSLuKu-LO8vZDvFORG1z7JJ6Hfsec"
  }
};

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

// Get popular TV shows
export const getPopularTVShows = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tv/popular`, options);
    const data = await response.json();
    return data.results.map(show => ({
      id: show.id,
      title: show.name,
      posterPath: show.poster_path,
      year: show.first_air_date ? show.first_air_date.substring(0, 4) : "",
      type: "tv"
    }));
  } catch (error) {
    console.error("Error fetching popular TV shows:", error);
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

// Get TV show details
export const getTVShowDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}`, options);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching TV show details for ID ${id}:`, error);
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
