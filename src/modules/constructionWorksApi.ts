export interface ConstructionWork {
  id: number;
  work_name: string;
  work_description: string | null;
  work_status: string;
  image_url: string;
  video_url: string;
  historical_price: number | null;
  base_year: number | null;
  created_at: string;
  formed_at: string | null;
  likes_count: number;
  is_mine: number;
  is_liked: number;
}
