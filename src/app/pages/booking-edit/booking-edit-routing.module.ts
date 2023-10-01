import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingEditPage } from './booking-edit.page';

const routes: Routes = [
  {
    path: '',
    component: BookingEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingEditPageRoutingModule {}
