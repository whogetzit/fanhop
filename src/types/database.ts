// Auto-generate the real version with:
//   supabase gen types typescript --local > src/types/database.ts
// This file is a placeholder with the shape you'll get after running migrations.

export interface Database {
  public: {
    Tables: {
      models: {
        Row: {
          id:           string
          user_id:      string
          name:         string
          weights:      Record<string, number>
          champion:     string | null
          is_public:    boolean
          share_slug:   string | null
          total_points: number
          score:        Record<string, number> | null
          like_count:   number
          created_at:   string
          updated_at:   string
        }
        Insert: {
          id?:          string
          user_id:      string
          name:         string
          weights:      Record<string, number>
          champion?:    string | null
          is_public?:   boolean
          share_slug?:  string | null
        }
        Update: Partial<Database['public']['Tables']['models']['Insert']>
      }
      model_likes: {
        Row: {
          model_id:   string
          user_id:    string
          created_at: string
        }
        Insert: {
          model_id: string
          user_id:  string
        }
        Update: never
      }
    }
    Views: {
      leaderboard: {
        Row: {
          id:           string
          name:         string
          champion:     string | null
          total_points: number
          rank:         number
          user_email:   string | null
        }
      }
    }
  }
}
