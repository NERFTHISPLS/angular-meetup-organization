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
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { AdminService } from '../../services/admin.service';

import { FetchError, UserEditData, UserFetchData } from '../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-table-row',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-table-row.component.html',
  styleUrl: './users-table-row.component.scss',
})
export class UsersTableRowComponent implements OnInit, OnDestroy {
  public adminService = inject(AdminService);
  public userService = inject(UserService);
  private changeDetector = inject(ChangeDetectorRef);

  @Input() user!: UserFetchData;

  private deleteUserSubscription: Subscription | null = null;
  private updateUserSubscription: Subscription | null = null;
  private changeRoleSubscription: Subscription | null = null;

  public isEditing = false;

  public errorMessage?: string;

  public nameControl!: FormControl<string | null>;
  public emailControl!: FormControl<string | null>;
  public roleControl!: FormControl<string | null>;

  ngOnInit(): void {
    this.initFormControls();
    this.disableFormControls();
  }

  ngOnDestroy(): void {
    if (this.deleteUserSubscription) {
      this.deleteUserSubscription.unsubscribe();
    }

    if (this.updateUserSubscription) {
      this.updateUserSubscription.unsubscribe();
    }

    if (this.changeRoleSubscription) {
      this.changeRoleSubscription.unsubscribe();
    }
  }

  public deleteUser() {
    this.deleteUserSubscription = this.adminService
      .deleteUser(this.user.id)
      .subscribe({
        error: (error: FetchError) => {
          this.handleFetchError(error);

          this.changeDetector.detectChanges();
        },
      });
  }

  public confirmEditUser() {
    if (!this.formControlsValid()) return;

    const userData: UserEditData = {
      id: this.user.id,
      email: <string>this.emailControl.value,
      fio: <string>this.nameControl.value,
    };

    this.updateUserSubscription = this.adminService
      .editUser(userData)
      .subscribe({
        error: (error: FetchError) => {
          this.handleFetchError(error);

          this.changeDetector.detectChanges();
        },
      });

    this.changeRoleSubscription = this.adminService
      .changeRole(userData.id, <string>this.roleControl.value)
      .subscribe({
        error: (error: FetchError) => {
          this.handleFetchError(error);

          this.changeDetector.detectChanges();
        },
      });
  }

  public editUser() {
    this.isEditing = true;
    this.enableFormControls();
  }

  private handleFetchError(error: FetchError) {
    console.error(error);

    if (error.status === 0) {
      this.errorMessage = 'Отсутствует интернет-соединение';
    } else {
      this.errorMessage = 'Что-то пошло не так :(';
    }
  }

  private initFormControls() {
    this.nameControl = new FormControl(this.user.fio, [Validators.required]);

    this.emailControl = new FormControl(this.user.email, [
      Validators.required,
      Validators.email,
    ]);

    this.roleControl = new FormControl(
      this.user.roles.find((role) => role.name === 'ADMIN') ? 'ADMIN' : 'USER',
      [Validators.required]
    );
  }

  private disableFormControls() {
    this.nameControl.disable();
    this.emailControl.disable();
    this.roleControl.disable();
  }

  private enableFormControls() {
    this.nameControl.enable();
    this.emailControl.enable();
    this.roleControl.enable();
  }

  private formControlsValid() {
    return (
      this.nameControl.valid &&
      this.emailControl.valid &&
      this.roleControl.valid
    );
  }
}
