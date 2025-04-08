
// API proxy service with MongoDB integration
import { insertDocument } from './mongoDBClient';

// Collections
const USER_VIEWS_COLLECTION = 'user_views';
const USER_AUTH_COLLECTION = 'user_auth';
const USER_WATCHLIST_COLLECTION = 'watchlist';

// Handle track-view endpoint
export const handleTrackView = async (requestData) => {
  console.log('Tracking user behavior:', requestData);
  
  try {
    await insertDocument(USER_VIEWS_COLLECTION, {
      ...requestData,
      recordedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error tracking view:', error);
    return { success: false, error: error.message };
  }
};

// Handle track-auth endpoint
export const handleTrackAuth = async (requestData) => {
  console.log('Tracking auth event:', requestData);
  
  try {
    await insertDocument(USER_AUTH_COLLECTION, {
      ...requestData,
      recordedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error tracking auth:', error);
    return { success: false, error: error.message };
  }
};

// Handle user-watchlist endpoint
export const handleWatchlistUpdate = async (requestData) => {
  console.log('Updating user watchlist:', requestData);
  
  try {
    await insertDocument(USER_WATCHLIST_COLLECTION, {
      ...requestData,
      recordedAt: new Date().toISOString()
    });
    
    return { success: true };
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
