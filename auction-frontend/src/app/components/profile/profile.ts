import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { UserDto } from '../../shared/models/user.dto';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  currentUser: UserDto | null = null;

  formData = {
    username: '',
    email: '',
    password: ''
  };

  isSaving = false;
  isDeleting = false;
  errorMessage = '';
  successMessage = '';
  deleteErrorMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.formData.username = this.currentUser.username;
    this.formData.email = this.currentUser.email;
  }

  onSubmit(): void {
    if (!this.currentUser) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.updateUser(this.currentUser.id, { ...this.formData }).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Dane zostały zapisane.';
        this.formData.password = '';

        const updatedUser: UserDto = {
          ...this.currentUser!,
          username: this.formData.username,
          email: this.formData.email
        };
        this.currentUser = updatedUser;
        this.authService.updateCurrentUser(updatedUser);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Nie udało się zapisać zmian.';
        this.cdr.detectChanges();
      }
    });
  }

  deleteAccount(): void {
    if (!this.currentUser) return;

    const confirmed = confirm(
      'Czy na pewno chcesz usunąć swoje konto? Tej operacji nie można odwrócić.'
    );
    if (!confirmed) return;

    this.isDeleting = true;
    this.deleteErrorMessage = '';

    this.userService.deleteUser(this.currentUser.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isDeleting = false;
        this.deleteErrorMessage = err.error?.message || 'Nie udało się usunąć konta.';
        this.cdr.detectChanges();
      }
    });
  }
}