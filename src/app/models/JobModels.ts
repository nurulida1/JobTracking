import { BaseModel } from './BaseModel';
import { WorkOrderDto } from './WorkOrderModel';

export interface JobDto extends BaseModel {
  WorkOrderId: number;
  WorkOrder: WorkOrderDto;
  CompletionDate: Date;
  CompletedBy?: string;
  ChecklistNotes?: string;
  Remarks?: string;
}
