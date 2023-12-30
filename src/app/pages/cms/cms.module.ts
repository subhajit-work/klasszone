import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CmsPageRoutingModule } from './cms-routing.module';

import { CmsPage } from './cms.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CmsPageRoutingModule
  ],
  declarations: [CmsPage]
})
export class CmsPageModule {}
