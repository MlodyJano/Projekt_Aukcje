import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuctionService } from '../../core/services/auction.service';

@Component({
  selector: 'app-auction-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auction-create.html',
  styleUrls: ['./auction-create.css']
})
export class AuctionCreateComponent implements OnInit {
  newAuction = {
    title: '',
    description: '',
    category: '',
    startingPrice: 0,
    endDate: '',
    ownerId: 0
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;

  constructor(private auctionService: AuctionService, private router: Router) {}

  ngOnInit(): void {
    const savedId = localStorage.getItem('userId');
    if (!savedId) {
      this.router.navigate(['/login']);
      return;
    }
    this.newAuction.ownerId = parseInt(savedId, 10);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  onSubmit(): void {
    if (!this.newAuction.title || !this.newAuction.endDate || !this.newAuction.category) {
      alert('Tytuł, kategoria i data zakończenia są wymagane!');
      return;
    }

    this.isSubmitting = true;

    const formattedData = {
      ...this.newAuction,
      endDate: new Date(this.newAuction.endDate).toISOString()
    };

    this.auctionService.createAuction(formattedData).subscribe({
      next: (auction) => {
        if (this.selectedFile) {
          this.auctionService.uploadImage(auction.id, this.selectedFile).subscribe({
            next: () => this.router.navigate(['/auctions']),
            error: () => this.router.navigate(['/auctions'])
          });
        } else {
          this.router.navigate(['/auctions']);
        }
      },
      error: () => {
        alert('Nie udało się dodać aukcji.');
        this.isSubmitting = false;
      }
    });
  }
}