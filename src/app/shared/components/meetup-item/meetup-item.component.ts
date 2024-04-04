import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-meetup-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meetup-item.component.html',
  styleUrl: './meetup-item.component.scss',
})
export class MeetupItemComponent {
  public isExpanded = false;

  public showMore() {
    this.isExpanded = true;
  }

  public showLess() {
    this.isExpanded = false;
  }
}
