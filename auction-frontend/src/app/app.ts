import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Auction {
  id: number;
  title: string;
  description: string;
  currentPrice: number;
  category: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  private apiUrl = 'https://localhost:7185/api'; 
  
  auctions: Auction[] = [];
  bidAmounts: { [key: number]: number } = {};
  bidderId = 2; 
  
  message = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAuctions();
  }

  loadAuctions() {
    this.http.get<Auction[]>(`${this.apiUrl}/auctions`).subscribe({
      next: (data) => {
        this.auctions = data;
        data.forEach(a => this.bidAmounts[a.id] = a.currentPrice + 1000);
      },
      error: (err) => {
        this.errorMessage = 'Nie udało się pobrać aukcji. Sprawdź backend i CORS.';
        console.error(err);
      }
    });
  }

  placeBid(auctionId: number) {
    this.message = '';
    this.errorMessage = '';
    
    const body = {
      amount: this.bidAmounts[auctionId],
      bidderId: this.bidderId
    };

    this.http.post(`${this.apiUrl}/auctions/${auctionId}/bids`, body).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Oferta złożona pomyślnie!';
        this.loadAuctions();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Wystąpił błąd licytacji.';
      }
    });
  }
}