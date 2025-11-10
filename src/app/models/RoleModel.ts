import { BaseModel } from './BaseModel';
import { UserDto } from './UserModel';

export interface Role extends BaseModel {
  userId: number;
  requestedRole: string;
  justification?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  user: UserDto;
}

export interface RoleRequest {
  userId: number;
  requestedRole: string;
  justification?: string;
  status: 'Pending';
  CreatedAt?: Date;
}

export interface DashboardSummaryRole {
  summary: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  recentPending: [];
}
