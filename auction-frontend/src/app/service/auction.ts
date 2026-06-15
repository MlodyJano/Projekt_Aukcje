import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BidDto {
  id: number;
  amount: number;
  bidderName: string;
  bidTime: string;
}

export interface AuctionDto {
  id: number;
  title: string;
  description: string;
  category: string;
  startingPrice: number;
  currentPrice: number;
  endTime: string;
  createdAt: string;
  bids: BidDto[];
}

export interface AuctionCreateDto {
  title: string;
  description: string;
  startingPrice: number;
  endTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private apiUrl = 'https://localhost:7185/api/auctions';

  constructor(private http: HttpClient) {}

  getAuctions(category?: string): Observable<AuctionDto[]> {
    let url = this.apiUrl;
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }
    return this.http.get<AuctionDto[]>(url);
  }

  placeBid(auctionId: number, amount: number, bidderName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${auctionId}/bids`, { amount, bidderName });
  }

  createAuction(auctionData: AuctionCreateDto): Observable<AuctionDto> {
    return this.http.post<AuctionDto>(this.apiUrl, auctionData);
  }
}