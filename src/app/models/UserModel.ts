import { UserRole } from '../shared/enum/enum';
import { BaseModel } from './BaseModel';

export interface UserDto extends BaseModel {
  FullName: string;
  Email: string;
  Role: UserRole;
  PhoneNumber: string;
  IsActive: boolean;
  Password: string;
}

export interface LoginRequest {
  Email: string;
  Password: string;
}

export interface ChangePasswordRequest {
  CurrentPassword: string;
  NewPassword: string;
}

export interface RegisterRequest {
  FullName: string;
  Email: string;
  Password: string;
  PhoneNumber: string;
  Role?: UserRole;
}
