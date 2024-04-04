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
