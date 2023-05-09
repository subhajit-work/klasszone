import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendOtpPageRoutingModule } from './send-otp-routing.module';

import { SendOtpPage } from './send-otp.page';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgOtpInputModule,
    SendOtpPageRoutingModule
  ],
  declarations: [SendOtpPage]
})
export class SendOtpPageModule {}
