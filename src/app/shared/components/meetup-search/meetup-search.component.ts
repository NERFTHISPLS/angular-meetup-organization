import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MeetupService } from '../../services/meetup.service';

@Component({
  selector: 'app-meetup-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './meetup-search.component.html',
  styleUrl: './meetup-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetupSearchComponent {
  public meetupService = inject(MeetupService);
  private formBuilder = inject(FormBuilder);

  public searchForm = this.formBuilder.nonNullable.group({
    query: [''],
    from: [''],
    to: [''],
  });

  public search() {
    const search = this.searchForm.controls.query.value;
    const from = this.searchForm.controls.from.value;
    const to = this.searchForm.controls.to.value;

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    this.meetupService.setMeetupsBy({
      query: search,
      from: fromDate,
      to: toDate,
    });
  }

  public reset() {
    this.searchForm.reset();
    this.meetupService.allMeetups = this.meetupService.allMeetupsOriginal;
  }
}
