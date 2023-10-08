import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BigBlueButtonPage } from './big-blue-button.page';

const routes: Routes = [
  {
    path: '',
    component: BigBlueButtonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BigBlueButtonPageRoutingModule {}
