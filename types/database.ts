// Database types for Supabase tables

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
      jobs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          company: string
          company_logo_url: string | null
          location: string
          job_type: 'full-time' | 'part-time' | 'contract' | 'internship'
          experience_level: 'entry' | 'mid' | 'senior' | 'lead'
          salary_range: string | null
          description: string
          requirements: string[]
          responsibilities: string[]
          benefits: string[]
          apply_url: string | null
          apply_type: 'external' | 'inline'
          is_active: boolean
          is_featured: boolean
          tags: string[]
          views_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          company: string
          company_logo_url?: string | null
          location: string
          job_type: 'full-time' | 'part-time' | 'contract' | 'internship'
          experience_level: 'entry' | 'mid' | 'senior' | 'lead'
          salary_range?: string | null
          description: string
          requirements: string[]
          responsibilities: string[]
          benefits: string[]
          apply_url?: string | null
          apply_type: 'external' | 'inline'
          is_active?: boolean
          is_featured?: boolean
          tags?: string[]
          views_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          company?: string
          company_logo_url?: string | null
          location?: string
          job_type?: 'full-time' | 'part-time' | 'contract' | 'internship'
          experience_level?: 'entry' | 'mid' | 'senior' | 'lead'
          salary_range?: string | null
          description?: string
          requirements?: string[]
          responsibilities?: string[]
          benefits?: string[]
          apply_url?: string | null
          apply_type?: 'external' | 'inline'
          is_active?: boolean
          is_featured?: boolean
          tags?: string[]
          views_count?: number
        }
      }
      applications: {
        Row: {
          id: string
          created_at: string
          job_id: string
          full_name: string
          email: string
          phone: string | null
          resume_url: string
          cover_letter: string | null
          status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted'
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          job_id: string
          full_name: string
          email: string
          phone?: string | null
          resume_url: string
          cover_letter?: string | null
          status?: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted'
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          job_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          resume_url?: string
          cover_letter?: string | null
          status?: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted'
          notes?: string | null
        }
      }
      resume_requests: {
        Row: {
          id: string
          created_at: string
          full_name: string
          email: string
          phone: string | null
          current_role: string | null
          target_role: string | null
          resume_url: string | null
          status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          full_name: string
          email: string
          phone?: string | null
          current_role?: string | null
          target_role?: string | null
          resume_url?: string | null
          status?: 'pending' | 'in-progress' | 'completed' | 'cancelled'
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          email?: string
          phone?: string | null
          current_role?: string | null
          target_role?: string | null
          resume_url?: string | null
          status?: 'pending' | 'in-progress' | 'completed' | 'cancelled'
          notes?: string | null
        }
      }
      admin_users: {
        Row: {
          id: string
          created_at: string
          user_id: string
          email: string
          full_name: string
          role: 'admin' | 'super_admin'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          email: string
          full_name: string
          role?: 'admin' | 'super_admin'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'super_admin'
        }
      }
    }
  }
}

