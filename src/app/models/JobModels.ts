import { JobPriority, JobStatus } from '../shared/enum/enum';
import { BaseModel } from './BaseModel';
import { UserDto } from './UserModel';
import { WorkOrderDto } from './WorkOrderModel';

export interface JobDto extends BaseModel {
  id: number;
  workOrderId: number;
  workOrder: WorkOrderDto;
  assignedToUserId?: number;
  assignedToUser?: UserDto;
  assignedByUserId?: number;
  assignedByUser: UserDto;
  description?: string;
  priority: JobPriority;
  dueDate?: Date;
  completionDate?: Date;
  completedBy?: string;
  checklistNotes?: string;
  remarks?: string;
  status: JobStatus;
}

export interface JobTaskResponse {
  success: boolean;
  userId: number;
  date: Date;
  taskCount: number;
  tasks: JobDto[]; // ✅ array if multiple tasks
}
