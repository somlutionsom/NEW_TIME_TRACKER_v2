import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://banfmxmtkpvfyoicpwda.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbmZteG10a3B2ZnlvaWNwd2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDgxMjAsImV4cCI6MjA3MzgyNDEyMH0.Dk_h31ZslWjwzQx6UeXM266kAx1z3Mgkoy0Nw8-KQaU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 타입 정의
export interface Task {
  id?: string
  user_id?: string
  app_name?: string
  name: string
  start_time: string
  end_time: string
  color: string
  created_at?: string
  updated_at?: string
}

export interface TaskColor {
  id?: string
  user_id?: string
  app_name?: string
  task_name: string
  color: string
  created_at?: string
}

export interface UserSettings {
  id?: string
  user_id?: string
  app_name?: string
  color_index: number
  created_at?: string
  updated_at?: string
}

// 클라이언트 사이드에서 사용할 Task 타입 (기존 HTML 버전과 호환)
export interface ClientTask {
  name: string
  start: string
  end: string
  color: string
}
