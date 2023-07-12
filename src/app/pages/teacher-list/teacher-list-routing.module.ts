import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeacherListPage } from './teacher-list.page';

const routes: Routes = [
  {
    path: '',
    component: TeacherListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherListPageRoutingModule {}
