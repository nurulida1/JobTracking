import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestRoleView } from './request-role-view/request-role-view';

const routes: Routes = [{ path: '', component: RequestRoleView }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRoleRoutingModule {}
