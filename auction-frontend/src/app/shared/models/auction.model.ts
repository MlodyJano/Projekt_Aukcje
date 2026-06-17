export interface Auction {
  id: number;
  title: string;
  description: string;
  category: string;
  startingPrice: number;
  currentPrice: number;
  startDate: Date;
  endDate: Date;
  status: string;
  ownerId: number;
  ownerUsername: string;
  imagePath?: string;
}