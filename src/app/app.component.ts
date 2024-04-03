import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './shared/components/header/header.component';
import { AllMeetupsComponent } from './pages/all-meetups/all-meetups.component';
import { MeetupFormComponent } from './pages/meetup-form/meetup-form.component';
import { UsersTableComponent } from './pages/users-table/users-table.component';
import { LoginComponent } from './pages/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    AllMeetupsComponent,
    MeetupFormComponent,
    UsersTableComponent,
    LoginComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-meetup-organization';
}
