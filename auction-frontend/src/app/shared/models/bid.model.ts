export interface Bid {
  id: number;
  amount: number;
  bidTime: Date;
  bidderId: number;
  bidderUsername: string;
}

export interface BidCreate {
  amount: number;
  bidderId: number;
}
