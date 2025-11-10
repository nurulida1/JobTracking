import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderView } from './purchase-order-view/purchase-order-view';
import { PurchaseOrderForm } from './purchase-order-form/purchase-order-form';

const routes: Routes = [
  {
    path: '',
    component: PurchaseOrderView,
  },
  {
    path: 'form',
    component: PurchaseOrderForm,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseOrderRoutingModule {}
