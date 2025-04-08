
// MongoDB client service
import { MongoClient } from 'mongodb';

const MONGODB_URI = "mongodb+srv://mhatredeep27:YqzpxF6c1qbh9uC3@cluster0.ou3zpr4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoDB client singleton
let client = null;
let database = null;

// Initialize the MongoDB client
export const connectToMongoDB = async () => {
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log('Connected to MongoDB successfully');
      database = client.db('plexstream');
    }
    return database;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// Get MongoDB collections
export const getCollection = async (collectionName) => {
  try {
    const db = await connectToMongoDB();
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw error;
  }
};

// Insert one document into a collection
export const insertDocument = async (collectionName, document) => {
  try {
    const collection = await getCollection(collectionName);
    return await collection.insertOne(document);
  } catch (error) {
    console.error(`Error inserting document into ${collectionName}:`, error);
    throw error;
  }
};

// Find documents in a collection
export const findDocuments = async (collectionName, query = {}, options = {}) => {
  try {
    const collection = await getCollection(collectionName);
    return await collection.find(query, options).toArray();
  } catch (error) {
    console.error(`Error finding documents in ${collectionName}:`, error);
    throw error;
  }
};

// Update a document in a collection
export const updateDocument = async (collectionName, filter, update) => {
  try {
    const collection = await getCollection(collectionName);
    return await collection.updateOne(filter, { $set: update });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

// Delete a document from a collection
export const deleteDocument = async (collectionName, filter) => {
  try {
    const collection = await getCollection(collectionName);
    return await collection.deleteOne(filter);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

// Close the MongoDB connection
export const closeConnection = async () => {
  try {
    if (client) {
      await client.close();
      client = null;
      database = null;
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
};
