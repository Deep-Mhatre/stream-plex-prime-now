// User behavior tracking service for Supabase

import { insertRecord } from './supabaseClient';

// Tables
const USER_VIEWS_TABLE = 'user_views';
const USER_INTERACTIONS_TABLE = 'user_interactions';

// Track user view of movie
export const trackMovieView = async (userId, movieId, movieTitle) => {
  try {
    const viewData = {
      user_id: userId,
      content_id: movieId.toString(),
      content_title: movieTitle,
      content_type: 'movie',
      action: 'view',
      timestamp: new Date().toISOString()
    };
    
    const result = await insertRecord(USER_VIEWS_TABLE, viewData);
    return result.success;
  } catch (error) {
    console.error('Error tracking movie view:', error);
    return false;
  }
};

// Track user watching trailer
export const trackTrailerView = async (userId, movieId, movieTitle) => {
  try {
    const viewData = {
      user_id: userId,
      content_id: movieId.toString(),
      content_title: movieTitle,
      content_type: 'movie',
      action: 'trailer_view',
      timestamp: new Date().toISOString()
    };
    
    const result = await insertRecord(USER_VIEWS_TABLE, viewData);
    return result.success;
  } catch (error) {
    console.error('Error tracking trailer view:', error);
    return false;
  }
};

// Track user watching full movie
export const trackWatchMovie = async (userId, movieId, movieTitle) => {
  try {
    const viewData = {
      user_id: userId,
      content_id: movieId.toString(),
      content_title: movieTitle,
      content_type: 'movie',
      action: 'watch_movie',
      timestamp: new Date().toISOString()
    };
    
    const result = await insertRecord(USER_VIEWS_TABLE, viewData);
    return result.success;
  } catch (error) {
    console.error('Error tracking movie watch:', error);
    return false;
  }
};

// Track user watching full TV show
export const trackWatchTVShow = async (userId, showId, showTitle, episode = null) => {
  try {
    const viewData = {
      user_id: userId,
      content_id: showId.toString(),
      content_title: showTitle,
      content_type: 'tv',
      action: 'watch_show',
      episode,
      timestamp: new Date().toISOString()
    };
    
    const result = await insertRecord(USER_VIEWS_TABLE, viewData);
    return result.success;
  } catch (error) {
    console.error('Error tracking TV show watch:', error);
    return false;
  }
};

// Track user search
export const trackSearch = async (userId, query, resultCount) => {
  try {
    const searchData = {
      user_id: userId,
      query,
      result_count: resultCount,
      action: 'search',
      timestamp: new Date().toISOString()
    };
    
    const result = await insertRecord(USER_INTERACTIONS_TABLE, searchData);
    return result.success;
  } catch (error) {
    console.error('Error tracking search:', error);
    return false;
  }
};

// Track user rating content
export const trackRating = async (userId, contentId, contentTitle, contentType, rating) => {
  try {
    const ratingData = {
      user_id: userId,
      content_id: contentId.toString(),
      content_title: contentTitle,
      content_type: contentType,
      rating,
      action: 'rate',
      timestamp: new Date().toISOString()
    };
    
    const result = await insertRecord(USER_INTERACTIONS_TABLE, ratingData);
    return result.success;
  } catch (error) {
    console.error('Error tracking rating:', error);
    return false;
  }
};