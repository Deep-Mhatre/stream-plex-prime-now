
// User-related services for MongoDB tracking
import { 
  insertDocument, 
  findDocuments, 
  updateDocument,
  getCollection 
} from './mongoDBClient';
import bcrypt from 'bcryptjs';

// Collections
const USERS_COLLECTION = 'users';
const WATCHLIST_COLLECTION = 'watchlist';
const USER_NAVIGATION_COLLECTION = 'user_navigation';

// Create a new user (signup)
export const createUser = async (name, email, password) => {
  try {
    // Check if user already exists
    const existingUsers = await findDocuments(USERS_COLLECTION, { email });
    if (existingUsers.length > 0) {
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
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    // Insert user into MongoDB
    const result = await insertDocument(USERS_COLLECTION, user);
    
    // Create a simplified user object for the client (without password)
    const clientUser = {
      name,
      email,
      initials,
      avatar: null,
      watchlist: [],
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
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
    const users = await findDocuments(USERS_COLLECTION, { email });
    if (users.length === 0) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    const user = users[0];
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    // Update last login time
    await updateDocument(USERS_COLLECTION, { email }, { lastLogin: new Date().toISOString() });
    
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
    const watchlistItems = await findDocuments(WATCHLIST_COLLECTION, { userId: user.email });
    clientUser.watchlist = watchlistItems.map(item => ({
      id: item.contentId,
      title: item.contentTitle,
      type: item.contentType,
      addedAt: item.addedAt
    }));
    
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
    
    // 2. Then store in MongoDB
    const watchlistItem = {
      userId,
      contentId,
      contentTitle,
      contentType,
      addedAt: new Date().toISOString()
    };
    
    // Check if item already exists in watchlist
    const existingItems = await findDocuments(WATCHLIST_COLLECTION, {
      userId,
      contentId
    });
    
    if (existingItems.length === 0) {
      // Item doesn't exist, add it
      await insertDocument(WATCHLIST_COLLECTION, watchlistItem);
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
    
    // 2. Then remove from MongoDB
    await getCollection(WATCHLIST_COLLECTION).then(collection => 
      collection.deleteOne({ userId, contentId })
    );
    
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
    
    // If not in localStorage or empty, get from MongoDB
    if (userId) {
      const watchlistItems = await findDocuments(WATCHLIST_COLLECTION, { userId });
      return watchlistItems.map(item => ({
        id: item.contentId,
        title: item.contentTitle,
        type: item.contentType,
        addedAt: item.addedAt
      }));
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
      userId,
      page,
      timestamp: new Date().toISOString()
    };
    
    await insertDocument(USER_NAVIGATION_COLLECTION, navigationData);
    return { success: true };
  } catch (error) {
    console.error('Error tracking navigation:', error);
    return { success: false, error: error.message };
  }
};
