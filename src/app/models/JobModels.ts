import { JobPriority, JobStatus, UserRole } from '../shared/enum/enum';
import { BaseModel } from './BaseModel';
import { UserDto } from './UserModel';
import { WorkOrderDto, WorkOrderTechnician } from './WorkOrderModel';

export interface JobDto extends BaseModel {
  jobNo: string;
  workOrderId: string;
  workOrder: WorkOrderDto;
  workOrderTechnicianId?: string;
  workOrderTechnician?: WorkOrderTechnician;
  assigntoUserId?: string;
  assignedToUser: UserDto;
  assignByUserId?: string;
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

export interface UpdateJobRequest {
  id: string;
  description?: string;
  priority: string;
  dueDate?: Date;
  remarks?: string;
}

export interface JobTaskResponse {
  success: boolean;
  userId: number;
  date: Date;
  taskCount: TaskCount;
  tasks: JobDto[];
  userRole: UserRole;
}

export interface TaskCount {
  active: number;
  completed: number;
  delyaed: number;
  pending: number;
}
