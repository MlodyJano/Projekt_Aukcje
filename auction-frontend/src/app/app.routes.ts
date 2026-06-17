import { Routes } from '@angular/router';
import { AUCTION_ROUTES } from './features/auctions/auctions.routes';

export const routes: Routes = [
  { path: '', redirectTo: '/auctions', pathMatch: 'full' },
  { path: 'auctions', children: AUCTION_ROUTES },
  { path: '**', redirectTo: '/auctions' }
];
