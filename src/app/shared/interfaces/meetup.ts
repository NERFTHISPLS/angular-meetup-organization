interface MeetupOwner {
  id: number;
  email: string;
  password: string;
  fio: string;
}

interface MeetupVisitor {
  id: number;
  email: string;
  password: string;
  fio: string;
}

export interface Meetup {
  id: number;
  name: string;
  description: string;
  location: string;
  targetAudience: string;
  needToKnow: string;
  willHappen: string;
  reasonToCome: string;
  time: string;
  duration: number;
  createdBy: number;
  owner: MeetupOwner;
  users: MeetupVisitor[];
}
