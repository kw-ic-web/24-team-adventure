import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY as string;

// Supabase 인스턴스 생성
const supabase = createClient(supabaseUrl, supabaseKey);

// Supabase 인스턴스를 기본 내보내기
export default supabase;
