export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          apt: string | null
          area: string
          city: string
          full_name: string | null
          id: string
          label: string | null
          landmark: string | null
          postal_code: string
          street_address: string
          user_id: string
        }
        Insert: {
          apt?: string | null
          area: string
          city: string
          full_name?: string | null
          id?: string
          label?: string | null
          landmark?: string | null
          postal_code: string
          street_address: string
          user_id: string
        }
        Update: {
          apt?: string | null
          area?: string
          city?: string
          full_name?: string | null
          id?: string
          label?: string | null
          landmark?: string | null
          postal_code?: string
          street_address?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          hero_gradient: string
          label: string
          slug: string
        }
        Insert: {
          hero_gradient?: string
          label: string
          slug: string
        }
        Update: {
          hero_gradient?: string
          label?: string
          slug?: string
        }
        Relationships: []
      }
      order_lines: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          quote_id: string | null
          total_bdt: number
          type: string
          unit_price_bdt: number
          variant: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          quote_id?: string | null
          total_bdt: number
          type: string
          unit_price_bdt: number
          variant?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          quote_id?: string | null
          total_bdt?: number
          type?: string
          unit_price_bdt?: number
          variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_lines_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_lines_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string
          delivery_address_id: string | null
          delivery_method: string
          duty_bdt: number
          handling_bdt: number
          id: string
          in_stock_eta: string | null
          local_delivery_bdt: number
          payment_method: string
          payment_reference: string | null
          payment_status: string
          placed_at: string
          pre_order_eta: string | null
          shipment_id: string | null
          shipping_bdt: number
          status: string
          subtotal_bdt: number
          total_bdt: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          delivery_address_id?: string | null
          delivery_method: string
          duty_bdt?: number
          handling_bdt?: number
          id: string
          in_stock_eta?: string | null
          local_delivery_bdt?: number
          payment_method: string
          payment_reference?: string | null
          payment_status: string
          placed_at?: string
          pre_order_eta?: string | null
          shipment_id?: string | null
          shipping_bdt?: number
          status: string
          subtotal_bdt: number
          total_bdt: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          delivery_address_id?: string | null
          delivery_method?: string
          duty_bdt?: number
          handling_bdt?: number
          id?: string
          in_stock_eta?: string | null
          local_delivery_bdt?: number
          payment_method?: string
          payment_reference?: string | null
          payment_status?: string
          placed_at?: string
          pre_order_eta?: string | null
          shipment_id?: string | null
          shipping_bdt?: number
          status?: string
          subtotal_bdt?: number
          total_bdt?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          available: boolean
          id: string
          name: string
          price_delta: number | null
          product_id: string
        }
        Insert: {
          available?: boolean
          id?: string
          name: string
          price_delta?: number | null
          product_id: string
        }
        Update: {
          available?: boolean
          id?: string
          name?: string
          price_delta?: number | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string
          category: string
          created_at: string
          description: string
          eta: string | null
          hero: string
          id: string
          images: string[]
          ingredients: string | null
          is_active: boolean
          name: string
          origin_country: string
          price_bdt: number
          price_usd: number | null
          rating: number
          review_count: number
          shipment_id: string | null
          slug: string
          source_retailer: string | null
          source_url: string | null
          status: string
          stock: number | null
          tags: string[]
          updated_at: string
        }
        Insert: {
          brand: string
          category: string
          created_at?: string
          description: string
          eta?: string | null
          hero?: string
          id: string
          images?: string[]
          ingredients?: string | null
          is_active?: boolean
          name: string
          origin_country: string
          price_bdt: number
          price_usd?: number | null
          rating?: number
          review_count?: number
          shipment_id?: string | null
          slug: string
          source_retailer?: string | null
          source_url?: string | null
          status: string
          stock?: number | null
          tags?: string[]
          updated_at?: string
        }
        Update: {
          brand?: string
          category?: string
          created_at?: string
          description?: string
          eta?: string | null
          hero?: string
          id?: string
          images?: string[]
          ingredients?: string | null
          is_active?: boolean
          name?: string
          origin_country?: string
          price_bdt?: number
          price_usd?: number | null
          rating?: number
          review_count?: number
          shipment_id?: string | null
          slug?: string
          source_retailer?: string | null
          source_url?: string | null
          status?: string
          stock?: number | null
          tags?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "products_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          admin_note: string | null
          budget_ceiling_bdt: number | null
          created_at: string
          customer_id: string
          customer_name: string
          customer_phone: string | null
          duty_bdt: number | null
          eta: string | null
          expires_at: string | null
          handling_bdt: number | null
          id: string
          inbound_shipping_bdt: number | null
          item_price_bdt: number | null
          margin_pct: number | null
          notes: string | null
          origin_country: string
          preferred_shipment_id: string | null
          product_name: string
          product_variant: string | null
          quantity: number
          requested_at: string
          shipment_id: string | null
          source_retailer: string
          source_url: string
          status: string
          total_bdt: number | null
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          budget_ceiling_bdt?: number | null
          created_at?: string
          customer_id: string
          customer_name: string
          customer_phone?: string | null
          duty_bdt?: number | null
          eta?: string | null
          expires_at?: string | null
          handling_bdt?: number | null
          id: string
          inbound_shipping_bdt?: number | null
          item_price_bdt?: number | null
          margin_pct?: number | null
          notes?: string | null
          origin_country: string
          preferred_shipment_id?: string | null
          product_name: string
          product_variant?: string | null
          quantity?: number
          requested_at?: string
          shipment_id?: string | null
          source_retailer: string
          source_url: string
          status: string
          total_bdt?: number | null
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          budget_ceiling_bdt?: number | null
          created_at?: string
          customer_id?: string
          customer_name?: string
          customer_phone?: string | null
          duty_bdt?: number | null
          eta?: string | null
          expires_at?: string | null
          handling_bdt?: number | null
          id?: string
          inbound_shipping_bdt?: number | null
          item_price_bdt?: number | null
          margin_pct?: number | null
          notes?: string | null
          origin_country?: string
          preferred_shipment_id?: string | null
          product_name?: string
          product_variant?: string | null
          quantity?: number
          requested_at?: string
          shipment_id?: string | null
          source_retailer?: string
          source_url?: string
          status?: string
          total_bdt?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_preferred_shipment_id_fkey"
            columns: ["preferred_shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_breakdowns: {
        Row: {
          category: string
          id: string
          item_count: number
          shipment_id: string
          value_bdt: number
        }
        Insert: {
          category: string
          id?: string
          item_count: number
          shipment_id: string
          value_bdt: number
        }
        Update: {
          category?: string
          id?: string
          item_count?: number
          shipment_id?: string
          value_bdt?: number
        }
        Relationships: [
          {
            foreignKeyName: "shipment_breakdowns_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_milestones: {
        Row: {
          completed_at: string | null
          id: string
          label: string
          position: number
          shipment_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          label: string
          position?: number
          shipment_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          label?: string
          position?: number
          shipment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipment_milestones_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          created_at: string
          customer_note: string | null
          cutoff_date: string
          id: string
          item_count: number
          landing_date: string
          liftoff_date: string
          number: number
          origin_country: string
          route: string
          status: string
          total_value_bdt: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_note?: string | null
          cutoff_date: string
          id: string
          item_count?: number
          landing_date: string
          liftoff_date: string
          number: number
          origin_country: string
          route: string
          status: string
          total_value_bdt?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_note?: string | null
          cutoff_date?: string
          id?: string
          item_count?: number
          landing_date?: string
          liftoff_date?: string
          number?: number
          origin_country?: string
          route?: string
          status?: string
          total_value_bdt?: number
          updated_at?: string
        }
        Relationships: []
      }
      tracking_steps: {
        Row: {
          description: string
          id: string
          label: string
          occurred_at: string | null
          order_id: string
          position: number
          status: string
        }
        Insert: {
          description?: string
          id?: string
          label: string
          occurred_at?: string | null
          order_id: string
          position?: number
          status: string
        }
        Update: {
          description?: string
          id?: string
          label?: string
          occurred_at?: string | null
          order_id?: string
          position?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_steps_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          default_address_id: string | null
          email: string
          id: string
          joined_at: string
          member_tier: string
          name: string
          phone: string | null
          points: number
          role: string
        }
        Insert: {
          default_address_id?: string | null
          email: string
          id: string
          joined_at?: string
          member_tier?: string
          name?: string
          phone?: string | null
          points?: number
          role?: string
        }
        Update: {
          default_address_id?: string | null
          email?: string
          id?: string
          joined_at?: string
          member_tier?: string
          name?: string
          phone?: string | null
          points?: number
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_users_default_address"
            columns: ["default_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          metadata: Json | null
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      allow_any_operation: {
        Args: { expected_operations: string[] }
        Returns: boolean
      }
      allow_only_operation: {
        Args: { expected_operation: string }
        Returns: boolean
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const
