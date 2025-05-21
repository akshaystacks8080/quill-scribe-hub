
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
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: string
          credits_used: number
          credits_total: number
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string
          credits_used?: number
          credits_total?: number
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string
          credits_used?: number
          credits_total?: number
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          original_text: string
          rewritten_text: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          original_text: string
          rewritten_text: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          original_text?: string
          rewritten_text?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
