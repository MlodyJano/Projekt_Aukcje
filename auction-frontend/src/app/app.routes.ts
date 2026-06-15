import { Routes } from '@angular/router';
<<<<<<< HEAD
import { AUCTION_ROUTES } from './features/auctions/auctions.routes';

export const routes: Routes = [
  { path: '', redirectTo: '/auctions', pathMatch: 'full' },
  { path: 'auctions', children: AUCTION_ROUTES },
  { path: '**', redirectTo: '/auctions' }
];
=======
import { AuctionCreateComponent } from './components/auction-create/auction-create';
import { AuctionListComponent } from './components/auction-list/auction-list';
import { RegisterComponent } from './components/register/register';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'auctions', pathMatch: 'full' },
  { path: 'auctions', component: AuctionListComponent },
  { path: 'add-auction', component: AuctionCreateComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent},
];
>>>>>>> 116236605183957f39815e5bf995c8b4e803760a
