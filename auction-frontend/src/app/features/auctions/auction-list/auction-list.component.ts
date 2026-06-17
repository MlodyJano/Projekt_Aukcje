import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuctionService } from '../../../core/services/auction.service';
import { Auction } from '../../../shared/models/auction.model';

@Component({
  selector: 'app-auction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.css']
})
export class AuctionListComponent implements OnInit, OnDestroy {
  auctions: Auction[] = [];
  categories: string[] = [];
  statuses: string[] = [];

  // Filtry
  selectedCategory: string = '';
  selectedStatus: string = '';

  // Stany
  isLoading = false;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(private auctionService: AuctionService) {}

  ngOnInit(): void {
    this.categories = this.auctionService.getCategories();
    this.statuses = this.auctionService.getStatuses();
    this.loadAuctions();
  }

  loadAuctions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.auctionService
      .getAuctions(this.selectedCategory || undefined, this.selectedStatus || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.auctions = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Błąd podczas pobierania aukcji:', error);
          this.errorMessage = 'Nie udało się pobrać aukcji. Sprawdzenie połączenie z backendem.';
          this.isLoading = false;
        }
      });
  }

  onFilterChange(): void {
    this.loadAuctions();
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

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
