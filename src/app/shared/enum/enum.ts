export enum DeliveryStatus {
  Pending = 'Pending',
  Delivered = 'Delivered',
}

export enum PurchaseOrderStatus {}

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
