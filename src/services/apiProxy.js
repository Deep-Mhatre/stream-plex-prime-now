// API proxy service with Supabase integration
import { insertRecord } from './supabaseClient';

// Tables
const USER_VIEWS_TABLE = 'user_views';
const USER_AUTH_TABLE = 'user_auth';
const WATCHLIST_TABLE = 'watchlist';

// Handle track-view endpoint
export const handleTrackView = async (requestData) => {
  console.log('Tracking user behavior:', requestData);
  
  try {
    const supabaseData = {
      user_id: requestData.userId,
      content_id: requestData.contentId?.toString(),
      content_title: requestData.contentTitle,
      content_type: requestData.contentType,
      action: requestData.action,
      episode: requestData.episode,
      timestamp: requestData.timestamp,
      recorded_at: new Date().toISOString()
    };
    
    const result = await insertRecord(USER_VIEWS_TABLE, supabaseData);
    
    return result;
  } catch (error) {
    console.error('Error tracking view:', error);
    return { success: false, error: error.message };
  }
};

// Handle track-auth endpoint
export const handleTrackAuth = async (requestData) => {
  console.log('Tracking auth event:', requestData);
  
  try {
    const supabaseData = {
      user_id: requestData.userId,
      action: requestData.action,
      timestamp: requestData.timestamp,
      recorded_at: new Date().toISOString()
    };
    
    const result = await insertRecord(USER_AUTH_TABLE, supabaseData);
    
    return result;
  } catch (error) {
    console.error('Error tracking auth:', error);
    return { success: false, error: error.message };
  }
};

// Handle user-watchlist endpoint
export const handleWatchlistUpdate = async (requestData) => {
  console.log('Updating user watchlist:', requestData);
  
  try {
    const supabaseData = {
      user_id: requestData.userId,
      content_id: requestData.contentId?.toString(),
      content_title: requestData.contentTitle,
      content_type: requestData.contentType,
      added_at: requestData.addedAt,
      recorded_at: new Date().toISOString()
    };
    
    const result = await insertRecord(WATCHLIST_TABLE, supabaseData);
    
    return result;
  } catch (error) {
    console.error('Error updating watchlist:', error);
    return { success: false, error: error.message };
  }
};

// Intercept fetch calls to our simulated API endpoints
const originalFetch = window.fetch;
window.fetch = async function(url, options) {
  // Handle our internal API endpoints
  if (url === '/api/track-view' && options?.method === 'POST') {
    const requestData = JSON.parse(options.body);
    const result = await handleTrackView(requestData);
    return {
      ok: true,
      json: async () => result
    };
  }
  
  // Handle auth tracking endpoint
  if (url === '/api/track-auth' && options?.method === 'POST') {
    const requestData = JSON.parse(options.body);
    const result = await handleTrackAuth(requestData);
    return {
      ok: true,
      json: async () => result
    };
  }
  
  // Handle watchlist updates
  if (url === '/api/user-watchlist' && options?.method === 'POST') {
    const requestData = JSON.parse(options.body);
    const result = await handleWatchlistUpdate(requestData);
    return {
      ok: true,
      json: async () => result
    };
  }
  
  // Pass through all other requests to the original fetch
  return originalFetch.apply(this, [url, options]);
};