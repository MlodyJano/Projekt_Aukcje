import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BidService } from '../../core/services/bid.service';
import { AuthService } from '../../core/services/auth.service';
import { Bid } from '../../shared/models/bid.model';

@Component({
  selector: 'app-my-bids',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-bids.html',
  styleUrls: ['./my-bids.css']
})
export class MyBidsComponent implements OnInit {
  bids: Bid[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private bidService: BidService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  const user = this.authService.currentUser;
  if (!user) return;

  this.isLoading = true;
  this.bidService.getBidsByUser(user.id).subscribe({
    next: (data) => {
      // Zostaw tylko jedną (najnowszą) ofertę na aukcję
      const seen = new Set<number>();
      this.bids = data.filter(bid => {
        if (seen.has(bid.auctionId)) return false;
        seen.add(bid.auctionId);
        return true;
      });
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.errorMessage = 'Nie udalo sie pobrac licytacji.';
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
}