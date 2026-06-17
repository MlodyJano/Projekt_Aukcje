import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuctionService } from '../../core/services/auction.service';
import { AuthService } from '../../core/services/auth.service';
import { Auction } from '../../shared/models/auction.model';

@Component({
  selector: 'app-my-auctions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-auctions.html',
  styleUrls: ['./my-auctions.css']
})
export class MyAuctionsComponent implements OnInit {
  auctions: Auction[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private auctionService: AuctionService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyAuctions();
  }

  loadMyAuctions(): void {
    this.isLoading = true;
    this.auctionService.getAuctions().subscribe({
      next: (data) => {
        const currentUser = this.authService.currentUser;
        this.auctions = data.filter(a => a.ownerId === currentUser?.id);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Nie udalo sie pobrac aukcji.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getDefaultImage(category: string): string {
    const map: { [key: string]: string } = {
      'Elektronika': 'categories/elektronika.svg',
      'Moda': 'categories/moda.svg',
      'Dom i Ogród': 'categories/dom.svg',
      'Motoryzacja': 'categories/motoryzacja.svg',
      'Książki': 'categories/ksiazki.svg',
      'Antyki': 'categories/antyki.svg',
      'Sport': 'categories/sport.svg'
    };
    return map[category] || 'categories/inne.svg';
  }

  translateStatus(status: string): string {
    const map: { [key: string]: string } = {
      'Active': 'Aktywna',
      'Ended': 'Zakonczona',
      'Cancelled': 'Anulowana'
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    const map: { [key: string]: string } = {
      'Active': 'status-active',
      'Ended': 'status-ended',
      'Cancelled': 'status-cancelled'
    };
    return map[status] || 'status-default';
  }
}