import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Role, UserFetchData } from '../../interfaces/user';

@Component({
  selector: 'app-users-table-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-table-row.component.html',
  styleUrl: './users-table-row.component.scss',
})
export class UsersTableRowComponent implements OnInit {
  @Input() user!: UserFetchData;

  public userRoleNames!: string;

  ngOnInit() {
    this.userRoleNames = this.user.roles.map((role) => role.name).join(', ');
  }
}
