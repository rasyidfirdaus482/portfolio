import { Database } from './database.types';

export type PostRow = Database['public']['Tables']['posts']['Row'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];

// Frontend-friendly interface extending the DB row
export interface Post extends PostRow {
    readingTime?: string;
    // You can add virtual frontend properties here
}
