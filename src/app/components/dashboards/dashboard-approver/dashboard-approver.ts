import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DashboardCount } from '../../../models/AppModels';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-approver',
  imports: [CommonModule],
  template: `<p>dashboard-approver works!</p>`,
  styleUrl: './dashboard-approver.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardApprover {
  @Input() dashboardCount: DashboardCount = {
    quotations: { pending: 0, approved: 0, rejected: 0 },
    jobs: { active: 0, pending: 0, delayed: 0 },
    workOrders: 0,
  };

  @Input() quotationChartData: any;
  @Input() quotationChartOptions: any;
}
