import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-delivery-form',
  imports: [],
  template: `<p>delivery-form works!</p>`,
  styleUrl: './delivery-form.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryForm {}
