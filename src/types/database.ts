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
    }
    Views: {}
  }
}
