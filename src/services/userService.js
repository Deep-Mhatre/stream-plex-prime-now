// User-related services for Supabase
import { 
  insertRecord, 
  selectRecords, 
  updateRecord,
  deleteRecord,
  supabase
} from './supabaseClient';
import bcrypt from 'bcryptjs';

// Tables
const USERS_TABLE = 'users';
const WATCHLIST_TABLE = 'watchlist';
const USER_NAVIGATION_TABLE = 'user_navigation';

// Create a new user (signup)
export const createUser = async (name, email, password) => {
  try {
    // Check if user already exists
    const existingUsers = await selectRecords(USERS_TABLE, { email });
    if (existingUsers.success && existingUsers.data.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create initials for avatar
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    // Create user object
    const user = {
      name,
      email,
      password: hashedPassword,
      initials,
      avatar: null,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };
    
    // Insert user into Supabase
    const result = await insertRecord(USERS_TABLE, user);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    // Create a simplified user object for the client (without password)
    const clientUser = {
      name,
      email,
      initials,
      avatar: null,
      watchlist: [],
      createdAt: user.created_at,
      lastLogin: user.last_login
    };
    
    // Also store in localStorage for the current session
    localStorage.setItem('user', JSON.stringify(clientUser));
    
    return { success: true, user: clientUser };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
};

// Authenticate user (login)
export const loginUser = async (email, password) => {
  try {
    // Find user by email
    const usersResult = await selectRecords(USERS_TABLE, { email });
    if (!usersResult.success || usersResult.data.length === 0) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    const user = usersResult.data[0];
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    // Update last login time
    await updateRecord(USERS_TABLE, { email }, { last_login: new Date().toISOString() });
    
    // Create a simplified user object for the client (without password)
    const clientUser = {
      name: user.name,
      email: user.email,
      initials: user.initials || user.email.charAt(0).toUpperCase(),
      avatar: user.avatar,
      watchlist: [],
      lastLogin: new Date().toISOString()
    };
    
    // Get user's watchlist
    const watchlistResult = await selectRecords(WATCHLIST_TABLE, { user_id: user.email });
    if (watchlistResult.success) {
      clientUser.watchlist = watchlistResult.data.map(item => ({
        id: item.content_id,
        title: item.content_title,
        type: item.content_type,
        addedAt: item.added_at
      }));
    }
    
    // Store in localStorage for the current session
    localStorage.setItem('user', JSON.stringify(clientUser));
    
    return { success: true, user: clientUser };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: error.message };
  }
};

// Add a movie/show to user's watchlist
export const addToWatchlist = async (userId, contentId, contentTitle, contentType) => {
  try {
    // 1. First update local storage
    const userDataStr = localStorage.getItem('user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      const watchlist = userData.watchlist || [];
      
      // Check if already in watchlist
      if (!watchlist.some(item => item.id === contentId)) {
        // Add to watchlist
        watchlist.push({
          id: contentId,
          title: contentTitle,
          type: contentType,
          addedAt: new Date().toISOString()
        });
        
        // Update localStorage
        userData.watchlist = watchlist;
        localStorage.setItem('user', JSON.stringify(userData));
      }
    }
    
    // 2. Then store in Supabase
    const watchlistItem = {
      user_id: userId,
      content_id: contentId,
      content_title: contentTitle,
      content_type: contentType,
      added_at: new Date().toISOString()
    };
    
    // Check if item already exists in watchlist
    const existingItems = await selectRecords(WATCHLIST_TABLE, {
      user_id: userId,
      content_id: contentId
    });
    
    if (!existingItems.success || existingItems.data.length === 0) {
      // Item doesn't exist, add it
      const result = await insertRecord(WATCHLIST_TABLE, watchlistItem);
      if (!result.success) {
        throw new Error(result.error);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return { success: false, error: error.message };
  }
};

// Remove from watchlist
export const removeFromWatchlist = async (userId, contentId) => {
  try {
    // 1. First update local storage
    const userDataStr = localStorage.getItem('user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      let watchlist = userData.watchlist || [];
      
      // Filter out the item
      watchlist = watchlist.filter(item => item.id !== contentId);
      
      // Update localStorage
      userData.watchlist = watchlist;
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    // 2. Then remove from Supabase
    const result = await deleteRecord(WATCHLIST_TABLE, { 
      user_id: userId, 
      content_id: contentId 
    });
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return { success: false, error: error.message };
  }
};

// Get user's watchlist
export const getUserWatchlist = async (userId) => {
  try {
    // Try to get from localStorage first for faster access
    const userDataStr = localStorage.getItem('user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      if (userData.watchlist && userData.watchlist.length > 0) {
        return userData.watchlist;
      }
    }
    
    // If not in localStorage or empty, get from Supabase
    if (userId) {
      const result = await selectRecords(WATCHLIST_TABLE, { user_id: userId });
      if (result.success) {
        return result.data.map(item => ({
          id: item.content_id,
          title: item.content_title,
          type: item.content_type,
          addedAt: item.added_at
        }));
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return [];
  }
};

// Track user navigation
export const trackNavigation = async (userId, page) => {
  try {
    const navigationData = {
      user_id: userId,
      page,
      timestamp: new Date().toISOString()
    };
    
    const result = await insertRecord(USER_NAVIGATION_TABLE, navigationData);
    return result;
  } catch (error) {
    console.error('Error tracking navigation:', error);
    return { success: false, error: error.message };
  }
};