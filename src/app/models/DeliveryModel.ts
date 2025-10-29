import { DeliveryStatus } from '../shared/enum/enum';
import { BaseModel } from './BaseModel';
import { PurchaseOrderDto } from './PurchaseOrderModel';

export interface DeliveryDto extends BaseModel {
  PurchaseOrderId: number;
  PurchaseOrder: PurchaseOrderDto;
  DeliveryETA?: Date;
  DeliveryDate?: Date;
  Status: DeliveryStatus;
  ReceivedBy?: string;
  Remark?: string;
}

export interface CreateDeliveryRequest {
  PurchaseOrderId: number;
  DeliveryETA?: Date;
  ReceivedBy: string;
  Remarks: string;
}

export interface UpdateDeliveryRequest extends CreateDeliveryRequest {
  Id: number;
}
