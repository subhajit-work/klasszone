import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassListPageRoutingModule } from './class-list-routing.module';

import { ClassListPage } from './class-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ClassListPageRoutingModule
  ],
  declarations: [ClassListPage]
})
export class ClassListPageModule {}
