import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-purchase-order-view',
  imports: [CommonModule],
  template: `<p>purchase-order-view works!</p>`,
  styleUrl: './purchase-order-view.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseOrderView {}
