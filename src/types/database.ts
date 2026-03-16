// Auto-generate the real version with:
//   supabase gen types typescript --local > src/types/database.ts

export interface Database {
  public: {
    Tables: {
      models: {
        Row: {
          id:         string
          user_id:    string
          name:       string
          weights:    Record<string, number>
          champion:   string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?:        string
          user_id:    string
          name:       string
          weights:    Record<string, number>
          champion?:  string | null
        }
        Update: Partial<Database['public']['Tables']['models']['Insert']>
      }
      analytics: {
        Row: {
          id:               number
          unique_visitors:  number
          models_created:   number
        }
        Insert: {
          id?:              number
          unique_visitors?: number
          models_created?:  number
        }
        Update: Partial<Database['public']['Tables']['analytics']['Insert']>
      }
      visits: {
        Row: {
          visitor_id:     string
          first_seen_at:  string
        }
        Insert: {
          visitor_id:      string
          first_seen_at?:  string
        }
        Update: Partial<Database['public']['Tables']['visits']['Insert']>
      }
    }
    Views: {}
  }
}
