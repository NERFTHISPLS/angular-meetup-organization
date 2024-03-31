import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './shared/components/header/header.component';
import { AllMeetupsComponent } from './pages/all-meetups/all-meetups.component';
import { MeetupFormComponent } from './pages/meetup-form/meetup-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    AllMeetupsComponent,
    MeetupFormComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-meetup-organization';
}
