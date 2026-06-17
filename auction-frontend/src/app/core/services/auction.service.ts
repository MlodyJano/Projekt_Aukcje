import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auction } from '../../shared/models/auction.model';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private apiUrl = '/api/auctions';

  constructor(private http: HttpClient) {}

  getAuctions(category?: string, status?: string): Observable<Auction[]> {
    let params = new HttpParams();

    if (category) params = params.set('category', category);
    if (status) params = params.set('status', status);

    return this.http.get<Auction[]>(this.apiUrl, { params });
  }

  getAuctionById(id: number): Observable<Auction> {
    return this.http.get<Auction>(`${this.apiUrl}/${id}`);
  }

  createAuction(auction: any): Observable<Auction> {
    return this.http.post<Auction>(this.apiUrl, auction);
  }

  updateAuction(id: number, auction: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, auction);
  }

  deleteAuction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCategories(): string[] {
    return ['Elektronika', 'Moda', 'Antyki', 'Sport', 'Książki', 'Inne'];
  }

  getStatuses(): string[] {
    return ['Active', 'Ended', 'Cancelled'];
  }
  uploadImage(id: number, file: File): Observable<{ imagePath: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post<{ imagePath: string }>(`${this.apiUrl}/${id}/image`, formData);
}
}
