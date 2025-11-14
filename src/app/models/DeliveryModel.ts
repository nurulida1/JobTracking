import { DeliveryStatus } from '../shared/enum/enum';
import { BaseModel } from './BaseModel';
import { PurchaseOrderDto } from './PurchaseOrderModel';

export interface DeliveryDto extends BaseModel {
  recordNo: string;
  deliveryNo: string;
  purchaseOrderId: number;
  purchaseOrder: PurchaseOrderDto;
  deliveryETA?: Date;
  deliveryDate?: Date;
  status: DeliveryStatus;
  receivedBy?: string;
  remark?: string;
}

export interface CreateDeliveryRequest {
  recordNo: string;
  purchaseOrderId: number;
  deliveryETA?: Date;
  receivedBy: string;
  remarks: string;
}

export interface UpdateDeliveryRequest extends CreateDeliveryRequest {
  id: number;
}
