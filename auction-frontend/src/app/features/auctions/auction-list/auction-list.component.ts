import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';

import { AuctionService } from '../../../core/services/auction.service';
import { Auction } from '../../../shared/models/auction.model';
  
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-auction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgOptimizedImage],
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.css']
})
export class AuctionListComponent implements OnInit, OnDestroy {
  auctions: Auction[] = [];
  categories: string[] = [];
  statuses: string[] = [];

  selectedCategory: string = '';
  selectedStatus: string = '';

  isLoading = false;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private auctionService: AuctionService,
    private cdr: ChangeDetectorRef
  ) {}

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
      .subscribe({
        next: (data) => {
          this.auctions = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Błąd:', error);
          this.errorMessage = 'Nie udało się pobrać aukcji.';
          this.isLoading = false;
          this.cdr.detectChanges();
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
  getDefaultImage(category: string): string {
    const map: { [key: string]: string } = {
      'Elektronika': 'categories/elektronika.webp',
      'Moda': 'categories/moda.webp',
      'Dom i Ogród': 'categories/dom.webp',
      'Motoryzacja': 'categories/motoryzacja.webp',
      'Książki': 'categories/ksiazki.webp',
      'Antyki': 'categories/antyki.webp',
      'Sport': 'categories/sport.webp',
      'Inne': 'categories/inne.webp'
    };
    return map[category] || 'categories/inne.png';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}