import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private userService = inject(UserService);

  public wasJustRegistered = this.userService.wasJustRegistered;

  ngOnDestroy(): void {
    this.userService.wasJustRegistered = false;
  }
}
