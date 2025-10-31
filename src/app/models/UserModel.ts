import { UserRole } from '../shared/enum/enum';
import { BaseModel } from './BaseModel';

export interface UserDto extends BaseModel {
  fullName: string;
  email: string;
  role: UserRole;
  phoneNumber: string;
  isActive: boolean;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  role?: UserRole;
}
