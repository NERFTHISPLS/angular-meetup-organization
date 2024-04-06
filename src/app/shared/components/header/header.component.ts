import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  public userService = inject(UserService);

  public logout() {
    this.userService.logout();

    this.router.navigate(['/login']);
  }

  public isLinkActive(url: string) {
    return this.router.url === url;
  }
}
