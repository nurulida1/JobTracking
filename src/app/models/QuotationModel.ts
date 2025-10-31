import { QuotationStatus } from '../shared/enum/enum';
import { BaseModel } from './BaseModel';

export interface QuotationDto extends BaseModel {
  quotationNo: string;
  vendorName: string;
  receivedDate: Date;
  description: string;
  quotationAmount: number;
  fileUrl: string;
  status: QuotationStatus;
  remarks: string;
}

export interface CreateQuotationRequest {
  quotationNo: string;
  vendorName: string;
  receivedDate: Date;
  description?: string;
  quotationAmount: number;
  fileUrl: string;
  remarks?: string;
}

export interface UpdateQuotationRequest extends CreateQuotationRequest {
  id: number;
}
