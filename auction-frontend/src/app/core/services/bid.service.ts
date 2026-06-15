import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bid, BidCreate } from '../../shared/models/bid.model';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  private apiUrl = 'https://localhost:7185/api/auctions';

  constructor(private http: HttpClient) {}

  /**
   * Pobiera historię ofert dla aukcji
   */
  getBidsForAuction(auctionId: number): Observable<Bid[]> {
    return this.http.get<Bid[]>(`${this.apiUrl}/${auctionId}/bids`);
  }

  /**
   * Składa nową ofertę
   */
  placeBid(auctionId: number, bid: BidCreate): Observable<any> {
    return this.http.post(`${this.apiUrl}/${auctionId}/bids`, bid);
  }
}
