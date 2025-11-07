import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderView } from './purchase-order-view/purchase-order-view';

const routes: Routes = [
  {
    path: '',
    component: PurchaseOrderView,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseOrderRoutingModule {}
