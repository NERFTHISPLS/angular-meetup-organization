import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { AdminService } from '../../services/admin.service';

import { FetchError, UserFetchData } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-table-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-table-row.component.html',
  styleUrl: './users-table-row.component.scss',
})
export class UsersTableRowComponent implements OnInit, OnDestroy {
  public adminService = inject(AdminService);
  public userService = inject(UserService);
  private changeDetector = inject(ChangeDetectorRef);

  @Input() user!: UserFetchData;

  private deleteUserSubscription: Subscription | null = null;

  public userRoleNames!: string;

  public errorMessage?: string;

  ngOnInit() {
    this.userRoleNames = this.user.roles.map((role) => role.name).join(', ');
  }

  ngOnDestroy(): void {
    if (this.deleteUserSubscription) {
      this.deleteUserSubscription.unsubscribe();
    }
  }

  public deleteUser() {
    if (this.user.id === this.userService.currentUser?.id) {
      this.errorMessage = 'Нельзя удалить самого себя';

      return;
    }

    this.deleteUserSubscription = this.adminService
      .deleteUser(this.user.id)
      .subscribe({
        error: (error: FetchError) => {
          console.error(error);

          if (error.status === 0) {
            this.errorMessage = 'Отсутствует интернет-соединение';
          } else {
            this.errorMessage = 'Что-то пошло не так :(';
          }

          this.changeDetector.detectChanges();
        },
      });
  }
}
