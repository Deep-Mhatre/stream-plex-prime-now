// Payment services for Supabase
import { insertRecord, selectRecords, updateRecord } from './supabaseClient';

// Tables
const PAYMENTS_TABLE = 'payments';
const SUBSCRIPTIONS_TABLE = 'subscriptions';

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
    
    // Convert to Supabase format
    const supabasePaymentData = {
      user_id: paymentData.userId,
      plan_id: paymentData.planId,
      plan_name: paymentData.planName,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      payment_method: paymentData.paymentMethod,
      card_last_four: paymentData.cardLastFour,
      card_brand: paymentData.cardBrand,
      status: paymentData.status || 'completed',
      timestamp: paymentData.timestamp
    };
    
    // Insert payment record
    const result = await insertRecord(PAYMENTS_TABLE, supabasePaymentData);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    // Update subscription status
    await updateSubscription(paymentData);
    
    return { success: true, paymentId: result.data[0].id };
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
    const existingSubscriptions = await selectRecords(SUBSCRIPTIONS_TABLE, { user_id: userId });
    
    if (existingSubscriptions.success && existingSubscriptions.data.length > 0) {
      // Update existing subscription
      const updateResult = await updateRecord(SUBSCRIPTIONS_TABLE, 
        { user_id: userId },
        {
          plan_id: planId,
          amount,
          status: 'active',
          last_payment: new Date().toISOString(),
          expiry_date: expiryDate.toISOString(),
          payment_method: paymentMethod
        }
      );
      
      if (!updateResult.success) {
        throw new Error(updateResult.error);
      }
    } else {
      // Create new subscription
      const subscriptionData = {
        user_id: userId,
        plan_id: planId,
        amount,
        status: 'active',
        start_date: new Date().toISOString(),
        last_payment: new Date().toISOString(),
        expiry_date: expiryDate.toISOString(),
        payment_method: paymentMethod,
        auto_renew: true
      };
      
      const insertResult = await insertRecord(SUBSCRIPTIONS_TABLE, subscriptionData);
      
      if (!insertResult.success) {
        throw new Error(insertResult.error);
      }
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
    const result = await selectRecords(SUBSCRIPTIONS_TABLE, { user_id: userId });
    
    if (result.success && result.data.length > 0) {
      const subscription = result.data[0];
      
      // Check if subscription is expired
      const now = new Date();
      const expiryDate = new Date(subscription.expiry_date);
      
      if (now > expiryDate) {
        // Subscription is expired
        await updateRecord(SUBSCRIPTIONS_TABLE, 
          { user_id: userId },
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
    const result = await selectRecords(PAYMENTS_TABLE, 
      { user_id: userId }, 
      { orderBy: { column: 'timestamp', ascending: false } }
    );
    
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error getting payment history:', error);
    return [];
  }
};