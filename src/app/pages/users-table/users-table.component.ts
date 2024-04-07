import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';

import { AdminService } from '../../shared/services/admin.service';

import { UsersTableRowComponent } from '../../shared/components/users-table-row/users-table-row.component';
import { Subscription } from 'rxjs';
import { FetchError } from '../../shared/interfaces/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CommonModule, UsersTableRowComponent],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
})
export class UsersTableComponent implements OnInit, OnDestroy {
  public adminService = inject(AdminService);
  private changeDetector = inject(ChangeDetectorRef);

  private allUsersSubscription: Subscription | null = null;

  public errorMessage?: string;

  ngOnInit(): void {
    this.allUsersSubscription = this.adminService.fetchAllUsers().subscribe({
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

  ngOnDestroy(): void {
    if (this.allUsersSubscription) {
      this.allUsersSubscription.unsubscribe();
    }

    this.adminService.allUsers = [];
  }
}
