import { PurchaseOrderStatus } from '../shared/enum/enum';
import { BaseModel } from './BaseModel';
import { QuotationDto } from './QuotationModel';

export interface PurchaseOrderDto extends BaseModel {
  PO: string;
  PODate: Date;
  POReceivedDate: Date;
  POAmount: number;
  Status: PurchaseOrderStatus;
  QuotationId: number;
  Quotation: QuotationDto;
  Site?: string;
  Project?: string;
  Client?: string;
  Description?: string;
  Remarks?: string;
}

export interface CreatePurchaseOrderRequest {
  PO: string;
  PODate: Date;
  POReceivedDate: Date;
  POAmount: number;
  QuotationId: number;
  Site?: string;
  Project?: string;
  Client?: string;
  Description?: string;
  Remarks?: string;
}

export interface UpdatePurchaseOrderRequest extends CreatePurchaseOrderRequest {
  Id: number;
}
