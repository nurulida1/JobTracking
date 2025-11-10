export enum DeliveryStatus {
  Pending = 'Pending',
  Delivered = 'Delivered',
}

export enum PurchaseOrderStatus {
  Draft = 'Draft',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export enum QuotationStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export enum UserRole {
  Admin = 'Admin',
  Approver = 'Approver',
  Technician = 'Technician',
  Guest = 'Guest',
}

export enum WorkOrderStatus {
  Pending = 'Pending',
  WIP = 'WIP',
  OnHold = 'OnHold',
  Completed = 'Completed',
}

export enum RoleRequestStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum JobPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export enum JobStatus {
  Pending = 'Pending',
  Active = 'Active',
  Delayed = 'Delayed',
  Completed = 'Completed',
}
