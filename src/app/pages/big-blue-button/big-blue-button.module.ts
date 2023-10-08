import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BigBlueButtonPageRoutingModule } from './big-blue-button-routing.module';

import { BigBlueButtonPage } from './big-blue-button.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    BigBlueButtonPageRoutingModule
  ],
  declarations: [BigBlueButtonPage]
})
export class BigBlueButtonPageModule {}
