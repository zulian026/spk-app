// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types untuk database
export interface Laptop {
  id: string
  name: string
  brand: string
  price: number
  processor: string
  processor_score: number
  ram: number
  storage: number
  storage_type: string
  graphics_card?: string
  graphics_type: string
  screen_size: number
  screen_resolution: string
  screen_type: string
  weight: number
  thickness?: number
  battery_capacity?: number
  battery_life?: number
  operating_system: string
  wifi_standard: string
  bluetooth_version: string
  usb_ports: number
  has_hdmi: boolean
  has_usb_c: boolean
  image_url?: string
  description?: string
  availability_status: string
  created_at: string
  updated_at: string
}

export interface LaptopCategory {
  id: string
  name: string
  description?: string
  icon?: string
  created_at: string
}

export interface UserPreference {
  id: string
  user_id?: string
  session_id?: string
  price_weight: number
  performance_weight: number
  ram_weight: number
  storage_weight: number
  weight_importance: number
  battery_weight: number
  max_budget?: number
  min_budget: number
  preferred_brands?: string[]
  primary_usage?: string
  screen_size_preference?: string
  preference_name?: string
  created_at: string
  updated_at: string
}

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}