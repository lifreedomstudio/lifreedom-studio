import { createClient } from '@supabase/supabase-js'

// 這裡會去抓取你設定在電腦或 Vercel 上的環境變數金鑰
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 建立並輸出這台 supabase 機器，讓其他頁面可以使用
export const supabase = createClient(supabaseUrl, supabaseAnonKey)