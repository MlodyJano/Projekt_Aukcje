import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuctionService, AuctionDto } from '../../../app/service/auction';

@Component({
  selector: 'app-auction-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auction-list.html',
  styleUrls: ['./auction-list.css']
})
export class AuctionListComponent implements OnInit {
  auctions: AuctionDto[] = [];
  selectedCategory: string = '';
  bidderName: string = localStorage.getItem('username') || 'Kupujący Testowy';

  constructor(private auctionService: AuctionService) {}

  ngOnInit(): void {
    this.loadAuctions();
  }

  loadAuctions(): void {
    this.auctionService.getAuctions(this.selectedCategory).subscribe({
      next: (data: AuctionDto[]) => {
        this.auctions = data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  onCategoryChange(): void {
    this.loadAuctions();
  }

  onBid(auctionId: number, currentPrice: number): void {
    const raise = 10;
    const newBid = currentPrice + raise;

    this.auctionService.placeBid(auctionId, newBid, this.bidderName).subscribe({
      next: (response: any) => {
        alert('Oferta złożona pomyślnie!');
        this.loadAuctions();
      },
      error: (err: any) => {
        console.error(err);
        alert('Nie udało się licytować: ' + (err.error?.message || err.statusText));
      }
    });
  }
}