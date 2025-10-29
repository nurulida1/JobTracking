import { QuotationStatus } from '../shared/enum/enum';
import { BaseModel } from './BaseModel';

export interface QuotationDto extends BaseModel {
  QuotationNo: string;
  VendorName: string;
  ReceivedDate: Date;
  Description: string;
  QuotationAmount: number;
  FileUrl: string;
  Status: QuotationStatus;
  Remarks: string;
}

export interface CreateQuotationRequest {
  QuotationNo: string;
  VendorName: string;
  ReceivedDate: Date;
  Description?: string;
  QuotationAmount: number;
  FileUrl: string;
  Remarks?: string;
}

export interface UpdateQuotationRequest extends CreateQuotationRequest {
  Id: number;
}
