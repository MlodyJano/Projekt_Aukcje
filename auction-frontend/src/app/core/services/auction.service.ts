import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auction } from '../../shared/models/auction.model';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  // Używamy względnego URL '/api' tak, aby działał proxy podczas developmentu
  private apiUrl = '/api/auctions';

  constructor(private http: HttpClient) {}

  /**
   * Pobiera wszystkie aukcje z opcjonalnym filtrowaniem
   */
  getAuctions(category?: string, status?: string): Observable<Auction[]> {
    let params = new HttpParams();

    if (category) params = params.set('category', category);
    if (status) params = params.set('status', status);

    return this.http.get<Auction[]>(this.apiUrl, { params });
  }

  /**
   * Pobiera szczegóły aukcji po ID
   */
  getAuctionById(id: number): Observable<Auction> {
    return this.http.get<Auction>(`${this.apiUrl}/${id}`);
  }

  /**
   * Tworzy nową aukcję
   */
  createAuction(auction: any): Observable<Auction> {
    return this.http.post<Auction>(this.apiUrl, auction);
  }

  /**
   * Aktualizuje aukcję
   */
  updateAuction(id: number, auction: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, auction);
  }

  /**
   * Usuwa aukcję
   */
  deleteAuction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Pobiera dostępne kategorie
   */
  getCategories(): string[] {
    return ['Elektronika', 'Moda', 'Antyki', 'Sport', 'Książki', 'Inne'];
  }

  /**
   * Pobiera dostępne statusy
   */
  getStatuses(): string[] {
    return ['Active', 'Ended', 'Cancelled'];
  }
}
