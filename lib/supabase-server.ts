import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseServerInstance: SupabaseClient | null = null;

/**
 * 서버 사이드에서 사용할 Supabase 클라이언트를 가져옵니다.
 * 서비스 역할 키를 사용하여 upsert 권한 확보
 * 지연 초기화로 환경 변수가 로드된 후에 클라이언트를 생성합니다.
 */
export function getSupabaseServer(): SupabaseClient {
  if (supabaseServerInstance) {
    return supabaseServerInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file."
    );
  }

  supabaseServerInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseServerInstance;
}

// 하위 호환성을 위한 export (지연 초기화)
export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseServer()[prop as keyof SupabaseClient];
  },
});
