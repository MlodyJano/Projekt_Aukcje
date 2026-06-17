import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';

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
  searchQuery: string = '';
  filteredAuctions: Auction[] = [];

  selectedCategory: string = '';
  selectedStatus: string = '';
  sortBy: string = '';

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
          this.applySearch();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = 'Nie udało się pobrać aukcji.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  applySearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    let result = query
      ? this.auctions.filter(a =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query) ||
          a.ownerUsername.toLowerCase().includes(query)
        )
      : [...this.auctions];

    if (this.sortBy === 'price_asc') result.sort((a, b) => {
      if (a.status === 'Active' && b.status !== 'Active') return -1;
      if (a.status !== 'Active' && b.status === 'Active') return 1;
      return a.currentPrice - b.currentPrice;
    });
    else if (this.sortBy === 'price_desc') result.sort((a, b) => {
      if (a.status === 'Active' && b.status !== 'Active') return -1;
      if (a.status !== 'Active' && b.status === 'Active') return 1;
      return b.currentPrice - a.currentPrice;
    });
    else if (this.sortBy === 'ending_soon') result.sort((a, b) => {
      if (a.status === 'Active' && b.status !== 'Active') return -1;
      if (a.status !== 'Active' && b.status === 'Active') return 1;
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    });
    else if (this.sortBy === 'newest') result.sort((a, b) => {
      if (a.status === 'Active' && b.status !== 'Active') return -1;
      if (a.status !== 'Active' && b.status === 'Active') return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
    else result.sort((a, b) => {
      if (a.status === 'Active' && b.status !== 'Active') return -1;
      if (a.status !== 'Active' && b.status === 'Active') return 1;
      return 0;
    });

    this.filteredAuctions = result;
    this.cdr.detectChanges();
  }

  onSortChange(): void {
    this.applySearch();
  }

  onSearchChange(): void {
  this.applySearch();
}

  onFilterChange(): void {
    this.loadAuctions();
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Active': 'status-active',
      'Ended': 'status-ended',
      'Cancelled': 'status-cancelled',
      'Inactive': 'status-cancelled'
    };
    return statusMap[status] || 'status-default';
  }

  translateStatus(status: string): string {
    if (!status) return '';
    
    const statusLower = status.toLowerCase(); 
    
    const dictionary: { [key: string]: string } = {
      'active': 'Aktywna',
      'ended': 'Zakończona',
      'cancelled': 'Anulowana',
      'inactive': 'Nieaktywna'
    };
    
    return dictionary[statusLower] || status; 
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

  isEndingSoon(endDate: string | Date): boolean {
    if (!endDate) return false;
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const hoursLeft = (end - now) / (1000 * 60 * 60);
    return hoursLeft > 0 && hoursLeft <= 24;
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}