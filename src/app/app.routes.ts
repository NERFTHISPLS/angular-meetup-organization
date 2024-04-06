import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AllMeetupsComponent } from './pages/all-meetups/all-meetups.component';
import { UsersTableComponent } from './pages/users-table/users-table.component';
import { AboutComponent } from './pages/about/about.component';
import { MeetupFormComponent } from './pages/meetup-form/meetup-form.component';

export const routes: Routes = [
  {
    title: 'Meetups | Логин',
    path: 'login',
    component: LoginComponent,
  },

  {
    title: 'Meetups | Регистрация',
    path: 'registration',
    component: RegistrationComponent,
  },

  {
    title: 'Meetups | Все митапы',
    path: '',
    component: AllMeetupsComponent,
  },

  {
    title: 'Meetups | Мои митапы',
    path: 'my-meetups',
    component: AllMeetupsComponent,
  },

  {
    title: 'Meetups | Пользователи',
    path: 'users',
    component: UsersTableComponent,
  },

  {
    title: 'Meetups | О приложении',
    path: 'about',
    component: AboutComponent,
  },

  {
    title: 'Meetups | Создать митап',
    path: 'create',
    component: MeetupFormComponent,
  },

  {
    title: 'Meetups | Редактирование митапа',
    path: 'edit/:id',
    component: MeetupFormComponent,
  },
];
