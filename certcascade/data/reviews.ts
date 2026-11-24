export interface Review {
  name: string;
  role: string;
  city?: string;
  rating?: number;
  text: string;
  category?: string;
}

export const reviews: Review[] = [];