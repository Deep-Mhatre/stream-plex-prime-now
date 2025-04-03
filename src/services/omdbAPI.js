
// OMDB API service to fetch additional movie and TV show data

const API_KEY = "fe53463f"; // OMDB API key
const BASE_URL = "https://www.omdbapi.org";

// Get movie by title and year
export const getMovieByTitle = async (title, year = "") => {
  try {
    const yearParam = year ? `&y=${year}` : "";
    const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&t=${encodeURIComponent(title)}${yearParam}&type=movie`);
    const data = await response.json();
    
    if (data.Response === "True") {
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
      return data.Search;
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
      return data.Search;
    }
    return [];
  } catch (error) {
    console.error("Error searching TV shows on OMDB:", error);
    return [];
  }
};
