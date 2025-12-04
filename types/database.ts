export interface Database {
  public: {
    Tables: {
      shops: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          shop_id: string | null;
          keywords: string[];
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          shop_id?: string | null;
          keywords?: string[];
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          shop_id?: string | null;
          keywords?: string[];
          position?: number;
          created_at?: string;
        };
      };
      items: {
        Row: {
          id: string;
          shop_id: string;
          name: string;
          category: string | null;
          qty: string | null;
          done: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          name: string;
          category?: string | null;
          qty?: string | null;
          done?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          shop_id?: string;
          name?: string;
          category?: string | null;
          qty?: string | null;
          done?: boolean;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Shop = Database['public']['Tables']['shops']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Item = Database['public']['Tables']['items']['Row'];
export type InsertItem = Database['public']['Tables']['items']['Insert'];
export type UpdateItem = Database['public']['Tables']['items']['Update'];
