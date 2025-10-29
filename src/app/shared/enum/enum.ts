export enum DeliveryStatus {
  Pending = 'Pending',
  Delivered = 'Delivered',
}

export enum PurchaseOrderStatus {}

export enum QuotationStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum UserRole {
  Admin = 'Admin',
  Approver = 'Approver',
  Technician = 'Technician',
}

export enum WorkOrderStatus {
  Pending = 'Pending',
  WIP = 'WIP',
  OnHold = 'OnHold',
  Completed = 'Completed',
}
