
// Payment services for MongoDB
import { insertDocument, findDocuments, updateDocument } from './mongoDBClient';

// Collections
const PAYMENTS_COLLECTION = 'payments';
const SUBSCRIPTIONS_COLLECTION = 'subscriptions';

// Record a new payment
export const recordPayment = async (paymentData) => {
  try {
    // Ensure required fields are present
    if (!paymentData.userId || !paymentData.planId || !paymentData.amount) {
      throw new Error('Missing required payment data');
    }
    
    // Add timestamp if not provided
    if (!paymentData.timestamp) {
      paymentData.timestamp = new Date().toISOString();
    }
    
    // Insert payment record
    const result = await insertDocument(PAYMENTS_COLLECTION, paymentData);
    
    // Update subscription status
    await updateSubscription(paymentData);
    
    return { success: true, paymentId: result.insertedId };
  } catch (error) {
    console.error('Error recording payment:', error);
    return { success: false, error: error.message };
  }
};

// Update user subscription based on payment
const updateSubscription = async (paymentData) => {
  try {
    const { userId, planId, amount, paymentMethod } = paymentData;
    
    // Calculate expiry date (1 month from now)
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    // Check if user already has a subscription
    const existingSubscriptions = await findDocuments(SUBSCRIPTIONS_COLLECTION, { userId });
    
    if (existingSubscriptions.length > 0) {
      // Update existing subscription
      await updateDocument(SUBSCRIPTIONS_COLLECTION, 
        { userId },
        {
          planId,
          amount,
          status: 'active',
          lastPayment: new Date().toISOString(),
          expiryDate: expiryDate.toISOString(),
          paymentMethod
        }
      );
    } else {
      // Create new subscription
      await insertDocument(SUBSCRIPTIONS_COLLECTION, {
        userId,
        planId,
        amount,
        status: 'active',
        startDate: new Date().toISOString(),
        lastPayment: new Date().toISOString(),
        expiryDate: expiryDate.toISOString(),
        paymentMethod,
        autoRenew: true
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

// Get user subscription status
export const getUserSubscription = async (userId) => {
  try {
    const subscriptions = await findDocuments(SUBSCRIPTIONS_COLLECTION, { userId });
    
    if (subscriptions.length > 0) {
      const subscription = subscriptions[0];
      
      // Check if subscription is expired
      const now = new Date();
      const expiryDate = new Date(subscription.expiryDate);
      
      if (now > expiryDate) {
        // Subscription is expired
        await updateDocument(SUBSCRIPTIONS_COLLECTION, 
          { userId },
          { status: 'expired' }
        );
        subscription.status = 'expired';
      }
      
      return subscription;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
};

// Get payment history for a user
export const getUserPaymentHistory = async (userId) => {
  try {
    const payments = await findDocuments(PAYMENTS_COLLECTION, { userId }, { sort: { timestamp: -1 } });
    return payments;
  } catch (error) {
    console.error('Error getting payment history:', error);
    return [];
  }
};
