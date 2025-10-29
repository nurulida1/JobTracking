import { WorkOrderStatus } from '../shared/enum/enum';
import { BaseModel } from './BaseModel';
import { PurchaseOrderDto } from './PurchaseOrderModel';

export interface WorkOrderDto extends BaseModel {
  WO: string;
  PurchaseOrderId: string;
  PurchaseOrder: PurchaseOrderDto;
  AssignedTo?: string;
  AssignedDate: Date;
  JobDescription?: string;
  Site?: string;
  JobSheetNo?: string;
  Remarks?: string;
  Status: WorkOrderStatus;
  StartedAt?: Date;
  OnHoldAt?: Date;
  CompletedAt?: Date;
}

export interface CreateWorkOrderRequest {
  PurchaseOrderId: number;
  AssignedTo?: string;
}

export interface UpdateWorkOrderRequest extends CreateWorkOrderRequest {
  Id: number;
}
