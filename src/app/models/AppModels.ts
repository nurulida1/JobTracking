export interface DashboardCount {
  quotations: {
    pending: number;
    approved: number;
    rejected: number;
  };
  jobs: {
    active: number;
    delayed: number;
    pending: number;
  };
  workOrders: number;
}
