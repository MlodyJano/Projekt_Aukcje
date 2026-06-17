import { Routes } from '@angular/router';
import { AUCTION_ROUTES } from './features/auctions/auctions.routes';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { AuctionCreateComponent } from './components/auction-create/auction-create';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auctions', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auctions', canActivate: [AuthGuard], children: AUCTION_ROUTES },
  { path: 'add-auction', component: AuctionCreateComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/auctions' }
];