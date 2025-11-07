import { BaseModel } from './BaseModel';

export interface Role extends BaseModel {
  userId: number;
  requestedRole: string;
  justification?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

export interface RoleRequest {
  userId: number;
  requestedRole: string;
  justification?: string;
  status: 'Pending';
  CreatedAt?: Date;
}
