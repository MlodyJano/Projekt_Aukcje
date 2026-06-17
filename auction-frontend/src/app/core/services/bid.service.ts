import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bid, BidCreate } from '../../shared/models/bid.model';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  private apiUrl = '/api/auctions';

  constructor(private http: HttpClient) {}
  getBidsForAuction(auctionId: number): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.apiUrl}/${auctionId}/bids`);
  }

  placeBid(auctionId: number, bid: BidCreate): Observable<any> {
    return this.http.post(`${this.apiUrl}/${auctionId}/bids`, bid);
  }

  getBidsByUser(userId: number): Observable<Bid[]> {
    return this.http.get<Bid[]>(`/api/users/${userId}/bids`);
  }
  
}
