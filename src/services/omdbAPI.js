
// OMDB API service to fetch additional movie and TV show data

const API_KEY = "fe53463f"; // OMDB API key
const BASE_URL = "https://www.omdbapi.org";
const FLIXFOX_URL = "https://apk.flixfox.com.in/en-US/video/8605915232380928?from=android";

// Get movie by title and year
export const getMovieByTitle = async (title, year = "") => {
  try {
    const yearParam = year ? `&y=${year}` : "";
    const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&t=${encodeURIComponent(title)}${yearParam}&type=movie`);
    const data = await response.json();
    
    if (data.Response === "True") {
      // Add FlixFox URL to the response
      data.watchUrl = FLIXFOX_URL;
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching movie from OMDB:", error);
    return null;
  }
};

// Get TV show by title and year
export const getTVShowByTitle = async (title, year = "") => {
  try {
    const yearParam = year ? `&y=${year}` : "";
    const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&t=${encodeURIComponent(title)}${yearParam}&type=series`);
    const data = await response.json();
    
    if (data.Response === "True") {
      // Add FlixFox URL to the response
      data.watchUrl = FLIXFOX_URL;
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching TV show from OMDB:", error);
    return null;
  }
};

// Search for movies by title
export const searchMovies = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
    const data = await response.json();
    
    if (data.Response === "True") {
      // Add FlixFox URL to each result
      return data.Search.map(movie => ({
        ...movie,
        watchUrl: FLIXFOX_URL
      }));
    }
    return [];
  } catch (error) {
    console.error("Error searching movies on OMDB:", error);
    return [];
  }
};

// Search for TV shows by title
export const searchTVShows = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=series`);
    const data = await response.json();
    
    if (data.Response === "True") {
      // Add FlixFox URL to each result
      return data.Search.map(show => ({
        ...show,
        watchUrl: FLIXFOX_URL
      }));
    }
    return [];
  } catch (error) {
    console.error("Error searching TV shows on OMDB:", error);
    return [];
  }
};

// Get watch URL for movies and TV shows
export const getWatchUrl = () => {
  return FLIXFOX_URL;
};
