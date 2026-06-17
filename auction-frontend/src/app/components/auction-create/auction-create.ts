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

  errors: { [key: string]: string } = {};

  get minDate(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  }

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

  validate(): boolean {
    this.errors = {};

    if (!this.newAuction.title.trim()) {
      this.errors['title'] = 'Tytuł jest wymagany.';
    } else if (this.newAuction.title.trim().length < 3) {
      this.errors['title'] = 'Tytuł musi mieć co najmniej 3 znaki.';
    }

    if (!this.newAuction.category) {
      this.errors['category'] = 'Wybierz kategorię.';
    }

    if (!this.newAuction.description.trim()) {
      this.errors['description'] = 'Opis jest wymagany.';
    } else if (this.newAuction.description.trim().length < 10) {
      this.errors['description'] = 'Opis musi mieć co najmniej 10 znaków.';
    }

    if (!this.newAuction.startingPrice || this.newAuction.startingPrice <= 0) {
      this.errors['startingPrice'] = 'Cena musi być większa od zera.';
    }

    if (!this.newAuction.endDate) {
      this.errors['endDate'] = 'Data zakończenia jest wymagana.';
    } else if (new Date(this.newAuction.endDate) <= new Date()) {
      this.errors['endDate'] = 'Data zakończenia musi być w przyszłości.';
    }

    return Object.keys(this.errors).length === 0;
  }

  onSubmit(): void {
    if (!this.validate()) return;

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
        this.errors['general'] = 'Nie udało się dodać aukcji. Spróbuj ponownie.';
        this.isSubmitting = false;
      }
    });
  }
}