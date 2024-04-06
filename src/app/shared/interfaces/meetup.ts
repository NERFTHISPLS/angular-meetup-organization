import { FormControl, FormGroup } from '@angular/forms';

interface MeetupOwner {
  id: number;
  email: string;
  password: string;
  fio: string;
  createdAt: string;
  updatedAt: string;
}

interface MeetupVisitor {
  UserMeetup: {
    createdAt: string;
    id: number;
    meetupId: number;
    updatedAt: number;
    userId: number;
  };
  id: number;
  email: string;
  password: string;
  fio: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meetup {
  id: number;
  name: string;
  description: string;
  location: string;
  target_audience: string;
  need_to_know: string;
  will_happen: string;
  reason_to_come: string;
  time: string;
  duration: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  owner: MeetupOwner;
  users: MeetupVisitor[];
}

export interface MeetupSignUpBody {
  idMeetup: number;
  idUser: number;
}

export interface MeetupCreateOptions {
  name: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  targetAudience: string;
  needToKnow: string;
  willHappen: string;
  reasonToCome: string;
}

export interface MeetupCreateBody {
  name: string;
  description: string;
  time: string;
  duration: number;
  location: string;
  target_audience: string;
  need_to_know: string;
  will_happen: string;
  reason_to_come: string;
}

export type MeetupCreationForm = FormGroup<{
  name: FormControl<string>;
  date: FormControl<string>;
  time: FormControl<string>;
  duration: FormControl<number>;
  location: FormControl<string>;
  description: FormControl<string>;
  targetAudience: FormControl<string>;
  needToKnow: FormControl<string>;
  willHappen: FormControl<string>;
  reasonToCome: FormControl<string>;
}>;
