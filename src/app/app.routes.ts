import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AllMeetupsComponent } from './pages/all-meetups/all-meetups.component';
import { UsersTableComponent } from './pages/users-table/users-table.component';
import { AboutComponent } from './pages/about/about.component';
import { MeetupFormComponent } from './pages/meetup-form/meetup-form.component';

import { logoutNavigationGuard } from './shared/guards/logout-navigation.guard';
import { loginNavigationGuard } from './shared/guards/login-navigation.guard';
import { adminGuard } from './shared/guards/admin.guard';
import { editMeetupGuard } from './shared/guards/edit-meetup.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    title: 'Meetups | Логин',
    path: 'login',
    component: LoginComponent,
    canActivate: [loginNavigationGuard],
  },

  {
    title: 'Meetups | Регистрация',
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [loginNavigationGuard],
  },

  {
    title: 'Meetups | Все митапы',
    path: '',
    component: AllMeetupsComponent,
    canActivate: [logoutNavigationGuard],
  },

  {
    title: 'Meetups | Мои митапы',
    path: 'my-meetups',
    component: AllMeetupsComponent,
    canActivate: [logoutNavigationGuard],
  },

  {
    title: 'Meetups | Пользователи',
    path: 'users',
    component: UsersTableComponent,
    canActivate: [logoutNavigationGuard, adminGuard],
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
    canActivate: [logoutNavigationGuard],
  },

  {
    title: 'Meetups | Редактирование митапа',
    path: 'edit/:id',
    component: MeetupFormComponent,
    canActivate: [logoutNavigationGuard, editMeetupGuard],
  },

  {
    title: 'Meetups | Страница не найдена',
    path: '**',
    component: PageNotFoundComponent,
  },
];
