export interface Bid {
  id: number;
  amount: number;
  bidTime: Date;
  bidderId: number;
  bidderUsername: string;
  auctionId: number;
  auctionTitle: string;
  auctionCategory: string;
  auctionImagePath?: string;
}

export interface BidCreate {
  amount: number;
  bidderId: number;
}