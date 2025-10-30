import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotationView } from './quotation-view/quotation-view';
import { QuotationForm } from './quotation-form/quotation-form';

const routes: Routes = [
  { path: '', component: QuotationView },
  { path: 'form', component: QuotationForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotationRoutingModule {}
