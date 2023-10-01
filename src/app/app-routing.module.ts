import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'send-otp',
    loadChildren: () => import('./pages/send-otp/send-otp.module').then( m => m.SendOtpPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'user/:slug',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'list',
    loadChildren: () => import('./pages/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'class-list/:slug',
    loadChildren: () => import('./pages/class-list/class-list.module').then( m => m.ClassListPageModule)
  },
  {
    path: 'teacher-list/:department/:class',
    loadChildren: () => import('./pages/teacher-list/teacher-list.module').then( m => m.TeacherListPageModule)
  },
  {
    path: 'teacher-profile/:tutor/:category/:course',
    loadChildren: () => import('./pages/teacher-profile/teacher-profile.module').then( m => m.TeacherProfilePageModule)
  },
  {
    path: 'booking-view/:status/:id',
    loadChildren: () => import('./pages/booking-view/booking-view.module').then( m => m.BookingViewPageModule)
  },
  {
    path: 'booking-edit/:status/:id',
    loadChildren: () => import('./pages/booking-edit/booking-edit.module').then( m => m.BookingEditPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
