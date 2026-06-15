import { Routes } from '@angular/router';
import { AuctionListComponent } from './auction-list/auction-list.component';
import { AuctionDetailComponent } from './auction-detail/auction-detail.component';

export const AUCTION_ROUTES: Routes = [
  { path: '', component: AuctionListComponent },
  { path: ':id', component: AuctionDetailComponent }
];
