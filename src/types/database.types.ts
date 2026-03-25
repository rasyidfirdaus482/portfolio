export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          type: 'blog' | 'project' | 'certificate'
          excerpt: string | null
          content: string | null
          category: string | null
          technologies: string[] | null
          issuer: string | null
          credential_url: string | null
          date: string
          published: boolean
          cover_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          type: 'blog' | 'project' | 'certificate'
          excerpt?: string | null
          content?: string | null
          category?: string | null
          technologies?: string[] | null
          issuer?: string | null
          credential_url?: string | null
          date?: string
          published?: boolean
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          type?: 'blog' | 'project' | 'certificate'
          excerpt?: string | null
          content?: string | null
          category?: string | null
          technologies?: string[] | null
          issuer?: string | null
          credential_url?: string | null
          date?: string
          published?: boolean
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
