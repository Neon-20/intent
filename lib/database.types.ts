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
      admin_users: {
        Row: {
          id: string
          email: string
          full_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          company: string
          description: string
          requirements: string | null
          category: string
          job_type: string
          experience_level: string
          location: string
          salary_range: string | null
          skills: string[]
          apply_url: string | null
          logo_url: string | null
          is_active: boolean
          posted_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          description: string
          requirements?: string | null
          category: string
          job_type: string
          experience_level: string
          location: string
          salary_range?: string | null
          skills?: string[]
          apply_url?: string | null
          logo_url?: string | null
          is_active?: boolean
          posted_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          description?: string
          requirements?: string | null
          category?: string
          job_type?: string
          experience_level?: string
          location?: string
          salary_range?: string | null
          skills?: string[]
          apply_url?: string | null
          logo_url?: string | null
          is_active?: boolean
          posted_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          job_id: string | null
          applicant_name: string
          email: string
          phone: string | null
          resume_url: string | null
          cover_letter: string | null
          linkedin_url: string | null
          portfolio_url: string | null
          status: string
          admin_notes: string | null
          submitted_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id?: string | null
          applicant_name: string
          email: string
          phone?: string | null
          resume_url?: string | null
          cover_letter?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          status?: string
          admin_notes?: string | null
          submitted_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string | null
          applicant_name?: string
          email?: string
          phone?: string | null
          resume_url?: string | null
          cover_letter?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          status?: string
          admin_notes?: string | null
          submitted_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      resume_requests: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          service_type: string
          current_resume_url: string | null
          message: string | null
          status: string
          admin_notes: string | null
          submitted_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          service_type: string
          current_resume_url?: string | null
          message?: string | null
          status?: string
          admin_notes?: string | null
          submitted_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          service_type?: string
          current_resume_url?: string | null
          message?: string | null
          status?: string
          admin_notes?: string | null
          submitted_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          status: string
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

