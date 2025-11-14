import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryView } from './delivery-view/delivery-view';
import { DeliveryForm } from './delivery-form/delivery-form';

const routes: Routes = [
  { path: '', component: DeliveryView },
  { path: 'form', component: DeliveryForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryRoutingModule {}
