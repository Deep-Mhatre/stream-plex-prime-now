// Supabase client configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for database operations
export const insertRecord = async (table, data) => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
    
    if (error) throw error
    return { success: true, data: result }
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error)
    return { success: false, error: error.message }
  }
}

export const selectRecords = async (table, query = {}, options = {}) => {
  try {
    let queryBuilder = supabase.from(table).select(options.select || '*')
    
    // Apply filters
    Object.entries(query).forEach(([key, value]) => {
      queryBuilder = queryBuilder.eq(key, value)
    })
    
    // Apply ordering
    if (options.orderBy) {
      queryBuilder = queryBuilder.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending !== false 
      })
    }
    
    // Apply limit
    if (options.limit) {
      queryBuilder = queryBuilder.limit(options.limit)
    }
    
    const { data, error } = await queryBuilder
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error(`Error selecting from ${table}:`, error)
    return { success: false, error: error.message }
  }
}

export const updateRecord = async (table, filter, updates) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .match(filter)
      .select()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error(`Error updating ${table}:`, error)
    return { success: false, error: error.message }
  }
}

export const deleteRecord = async (table, filter) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .match(filter)
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error)
    return { success: false, error: error.message }
  }
}