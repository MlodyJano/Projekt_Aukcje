import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuctionService } from '../../../core/services/auction.service';
import { BidService } from '../../../core/services/bid.service';
import { AuthService } from '../../../core/services/auth.service';
import { Auction } from '../../../shared/models/auction.model';
import { Bid } from '../../../shared/models/bid.model';

@Component({
  selector: 'app-auction-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.css']
})
export class AuctionDetailComponent implements OnInit, OnDestroy {
  auction: Auction | null = null;
  bids: Bid[] = [];

  bidAmount = 0;

  isLoading = false;
  isLoadingBids = false;
  isSubmittingBid = false;
  errorMessage = '';
  successMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auctionService: AuctionService,
    private bidService: BidService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const auctionId = parseInt(params['id'], 10);
      if (!isNaN(auctionId)) {
        this.loadAuctionDetail(auctionId);
        this.loadBids(auctionId);
      }
    });
  }

  loadAuctionDetail(auctionId: number): void {
    this.isLoading = true;
    this.auctionService
      .getAuctionById(auctionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.auction = data;
          this.bidAmount = data.currentPrice + 100;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = 'Nie udało się pobrać szczegółów aukcji.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  loadBids(auctionId: number): void {
    this.isLoadingBids = true;
    this.bidService
      .getBidsForAuction(auctionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.bids = data.sort((a, b) => new Date(b.bidTime).getTime() - new Date(a.bidTime).getTime());
          this.isLoadingBids = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
          this.isLoadingBids = false;
          this.cdr.detectChanges();
        }
      });
  }

  submitBid(): void {
    if (!this.auction) return;

    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.bidAmount || this.bidAmount <= this.auction.currentPrice) {
      this.errorMessage = `Oferta musi być wyższa niż aktualna cena (${this.auction.currentPrice} zł)`;
      return;
    }

    this.isSubmittingBid = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.bidService
      .placeBid(this.auction.id, {
        amount: this.bidAmount,
        bidderId: currentUser.id
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Oferta złożona pomyślnie!';
          this.isSubmittingBid = false;
          this.loadAuctionDetail(this.auction!.id);
          this.loadBids(this.auction!.id);
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = error.error?.message || 'Nie udało się złożyć oferty.';
          this.isSubmittingBid = false;
          this.cdr.detectChanges();
        }
      });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Active': 'status-active',
      'Ended': 'status-ended',
      'Cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-default';
  }

  getTimeRemaining(endDate: Date): string {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Aukcja zakończona';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  goBack(): void {
    this.router.navigate(['/auctions']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}