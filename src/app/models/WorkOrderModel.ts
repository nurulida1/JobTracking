import { WorkOrderStatus } from '../shared/enum/enum';
import { BaseModel } from './BaseModel';
import { PurchaseOrderDto } from './PurchaseOrderModel';
import { UserDto } from './UserModel';

export interface WorkOrderDto extends BaseModel {
  workOrderNo: string;
  purchaseOrderId: string;
  purchaseOrder: PurchaseOrderDto;
  jobDescription?: string;
  site?: string;
  jobSheetNo?: string;
  remarks?: string;
  status: WorkOrderStatus;
  assignedDate: Date;
  startedAt?: Date;
  onHoldAt?: Date;
  completedAt?: Date;
  technicians?: WorkOrderTechnician[];
}

export interface WorkOrderTechnician {
  id: string;
  workOrderId: string;
  workOrder: WorkOrderDto;
  userId: string;
  technician: UserDto;
  assignedAt: Date;
}

export interface UpdateWorkOrderRequest {
  id: string;
  jobDescription?: string;
  site?: string;
  remarks?: string;
  technicianIds?: string[];
}

export interface AssignTechniciansRequest {
  workOrderId: string;
  technicianIds: string[];
}
