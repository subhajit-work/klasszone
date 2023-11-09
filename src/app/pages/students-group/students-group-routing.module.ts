import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentsGroupPage } from './students-group.page';

const routes: Routes = [
  {
    path: '',
    component: StudentsGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsGroupPageRoutingModule {}
