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
        Relationships: []
      }
      rate_limits: {
        Row: {
          id:         number
          key:        string
          created_at: string
        }
        Insert: {
          id?:        number
          key:        string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['rate_limits']['Insert']>
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
  }
}
