import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobView } from './job-view/job-view';

const routes: Routes = [{ path: '', component: JobView }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobRoutingModule {}
