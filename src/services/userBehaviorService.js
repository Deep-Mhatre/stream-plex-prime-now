
// User behavior tracking service for MongoDB

import { insertDocument } from './mongoDBClient';

// Collections
const USER_VIEWS_COLLECTION = 'user_views';
const USER_INTERACTIONS_COLLECTION = 'user_interactions';

// Track user view of movie
export const trackMovieView = async (userId, movieId, movieTitle) => {
  try {
    const viewData = {
      userId,
      contentId: movieId,
      contentTitle: movieTitle,
      contentType: 'movie',
      action: 'view',
      timestamp: new Date().toISOString()
    };
    
    await insertDocument(USER_VIEWS_COLLECTION, viewData);
    return true;
  } catch (error) {
    console.error('Error tracking movie view:', error);
    return false;
  }
};

// Track user watching trailer
export const trackTrailerView = async (userId, movieId, movieTitle) => {
  try {
    const viewData = {
      userId,
      contentId: movieId,
      contentTitle: movieTitle,
      contentType: 'movie',
      action: 'trailer_view',
      timestamp: new Date().toISOString()
    };
    
    await insertDocument(USER_VIEWS_COLLECTION, viewData);
    return true;
  } catch (error) {
    console.error('Error tracking trailer view:', error);
    return false;
  }
};

// Track user watching full movie
export const trackWatchMovie = async (userId, movieId, movieTitle) => {
  try {
    const viewData = {
      userId,
      contentId: movieId,
      contentTitle: movieTitle,
      contentType: 'movie',
      action: 'watch_movie',
      timestamp: new Date().toISOString()
    };
    
    await insertDocument(USER_VIEWS_COLLECTION, viewData);
    return true;
  } catch (error) {
    console.error('Error tracking movie watch:', error);
    return false;
  }
};

// Track user watching full TV show
export const trackWatchTVShow = async (userId, showId, showTitle, episode = null) => {
  try {
    const viewData = {
      userId,
      contentId: showId,
      contentTitle: showTitle,
      contentType: 'tv',
      action: 'watch_show',
      episode,
      timestamp: new Date().toISOString()
    };
    
    await insertDocument(USER_VIEWS_COLLECTION, viewData);
    return true;
  } catch (error) {
    console.error('Error tracking TV show watch:', error);
    return false;
  }
};

// Track user search
export const trackSearch = async (userId, query, resultCount) => {
  try {
    const searchData = {
      userId,
      query,
      resultCount,
      action: 'search',
      timestamp: new Date().toISOString()
    };
    
    await insertDocument(USER_INTERACTIONS_COLLECTION, searchData);
    return true;
  } catch (error) {
    console.error('Error tracking search:', error);
    return false;
  }
};

// Track user rating content
export const trackRating = async (userId, contentId, contentTitle, contentType, rating) => {
  try {
    const ratingData = {
      userId,
      contentId,
      contentTitle,
      contentType,
      rating,
      action: 'rate',
      timestamp: new Date().toISOString()
    };
    
    await insertDocument(USER_INTERACTIONS_COLLECTION, ratingData);
    return true;
  } catch (error) {
    console.error('Error tracking rating:', error);
    return false;
  }
};
