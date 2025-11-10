import { PurchaseOrderStatus } from '../shared/enum/enum';
import { BaseModel } from './BaseModel';
import { QuotationDto } from './QuotationModel';

export interface PurchaseOrderDto extends BaseModel {
  po: string;
  poDate: Date;
  poReceivedDate: Date;
  poAmount: number;
  status: PurchaseOrderStatus;
  quotationId: number;
  quotation: QuotationDto;
  site?: string;
  project?: string;
  client?: string;
  description?: string;
  remarks?: string;
}

export interface CreatePurchaseOrderRequest {
  po: string;
  poDate: Date;
  poReceivedDate: Date;
  poAmount: number;
  quotationId: number;
  site?: string;
  project?: string;
  client?: string;
  description?: string;
  remarks?: string;
}

export interface UpdatePurchaseOrderRequest extends CreatePurchaseOrderRequest {
  id: number;
}
