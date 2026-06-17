import { Routes } from '@angular/router';
import { AUCTION_ROUTES } from './features/auctions/auctions.routes';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { AuctionCreateComponent } from './components/auction-create/auction-create';
import { MyAuctionsComponent } from './components/my-auctions/my-auctions';
import { AuthGuard } from './core/guards/auth.guard';
import { MyBidsComponent } from './components/my-bids/my-bids';

export const routes: Routes = [
  { path: '', redirectTo: '/auctions', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auctions', canActivate: [AuthGuard], children: AUCTION_ROUTES },
  { path: 'my-auctions', component: MyAuctionsComponent, canActivate: [AuthGuard] },
  { path: 'my-bids', component: MyBidsComponent, canActivate: [AuthGuard] },
  { path: 'add-auction', component: AuctionCreateComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/auctions' }
];