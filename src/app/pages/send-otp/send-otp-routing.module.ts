import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendOtpPage } from './send-otp.page';

const routes: Routes = [
  {
    path: '',
    component: SendOtpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendOtpPageRoutingModule {}
