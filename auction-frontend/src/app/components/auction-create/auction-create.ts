import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuctionService } from '../../../app/service/auction';

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
    endTime: '',
    ownerId: 0
  };

  constructor(private auctionService: AuctionService, private router: Router) {}

  ngOnInit(): void {
    const savedId = localStorage.getItem('userId');
    if (!savedId) {
      alert('Musisz być zalogowany, aby wystawić przedmiot!');
      this.router.navigate(['/login']);
      return;
    }
    this.newAuction.ownerId = parseInt(savedId, 10);
  }

  onSubmit(): void {
    if (!this.newAuction.title || !this.newAuction.endTime || !this.newAuction.category) {
      alert('Tytuł, kategoria i data zakończenia są wymagane!');
      return;
    }

    const formattedData = {
      ...this.newAuction,
      endTime: new Date(this.newAuction.endTime).toISOString()
    };

    this.auctionService.createAuction(formattedData).subscribe({
      next: (response: any) => {
        alert('Aukcja została dodana pomyślnie!');
        this.router.navigate(['/auctions']);
      },
      error: (err: any) => {
        console.error(err);
        alert('Nie udało się dodać aukcji.');
      }
    });
  }
}