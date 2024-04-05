import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-meetup-form',
  standalone: true,
  imports: [],
  templateUrl: './meetup-form.component.html',
  styleUrl: './meetup-form.component.scss',
})
export class MeetupFormComponent {
  private location = inject(Location);

  public routerReturnBack() {
    this.location.back();
  }
}
