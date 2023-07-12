import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeacherListPageRoutingModule } from './teacher-list-routing.module';

import { TeacherListPage } from './teacher-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TeacherListPageRoutingModule
  ],
  declarations: [TeacherListPage]
})
export class TeacherListPageModule {}
