export interface Hospital {
  id: number;
  ykiho?: string; // 요양기관기호
  name: string;
  slug?: string; // URL Friendly slug
  address: string;
  phone: string;
  description?: string;
  image?: string;
  cost?: number; // 비용 (원 단위)
  treatment_price?: number; // 도수치료 가격 (원 단위, 음수면 지역 평균)
  operatingHours?: {
    [key: string]: string; // 예: { "월": "09:00-18:00", "화": "09:00-18:00" }
  };
  operating_hours?: any; // DB 컬럼명 (snake_case) 지원
  specialties?: string[]; // 진료과목 배열
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  created_at?: string; // DB 컬럼명 지원
  updatedAt?: string;
  updated_at?: string; // DB 컬럼명 지원
}

export interface HospitalFilters {
  region?: string; // 시/도
  district?: string; // 시/군/구
  minCost?: number;
  maxCost?: number;
  searchQuery?: string;
  sortBy?: "name" | "region" | "cost";
}

