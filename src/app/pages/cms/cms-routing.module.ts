import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CmsPage } from './cms.page';

const routes: Routes = [
  {
    path: '',
    component: CmsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsPageRoutingModule {}
