export interface Quote {
  id: number;
  image: string;
}
  
export interface QuotesResponse {
  quotes: Quote[];
  totalPages: number;
  totalQuotes: number;
}

export interface Gender {
  male: number;
  female: number;
  lgbtqia: number;
}
