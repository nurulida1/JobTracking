import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobView } from './job-view/job-view';
import { JobDetails } from './job-details/job-details';

const routes: Routes = [
  { path: '', component: JobView },
  { path: 'details', component: JobDetails },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobRoutingModule {}
