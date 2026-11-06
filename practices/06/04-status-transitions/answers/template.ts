import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  HttpException,
  NotFoundException,
} from "./exceptions.js";

export const DELIVERY_STATUSES = [
  "ordered",
  "packed",
  "shipping",
  "delivered",
  "canceled",
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

export const DELIVERY_STATUS_TRANSITIONS: Record<
  DeliveryStatus,
  readonly DeliveryStatus[]
> = {
  ordered: ["packed", "canceled"],
  packed: ["shipping", "canceled"],
  shipping: ["delivered"],
  delivered: [],
  canceled: [],
};

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(HTTP_STATUS.CONFLICT, message);
  }
}

export interface Parcel {
  id: number;
  item: string;
  status: DeliveryStatus;
}

export class ParcelRepository {
  private readonly parcels = new Map<number, Parcel>();

  constructor(parcels: Parcel[]) {
    for (const parcel of parcels) {
      this.parcels.set(parcel.id, { ...parcel });
    }
  }

  async findById(id: number): Promise<Parcel | undefined> {
    return this.parcels.get(id);
  }

  async updateStatus(parcel: Parcel, status: DeliveryStatus): Promise<Parcel> {
    const updatedParcel = { ...parcel, status };
    this.parcels.set(parcel.id, updatedParcel);
    return updatedParcel;
  }
}

export interface ParcelResponse {
  id: number;
  item: string;
  status: DeliveryStatus;
  allowedNextStatuses: DeliveryStatus[];
}

export function toParcelResponse(parcel: Parcel): ParcelResponse {
  return {
    id: parcel.id,
    item: parcel.item,
    status: parcel.status,
    allowedNextStatuses: [...DELIVERY_STATUS_TRANSITIONS[parcel.status]],
  };
}

export class DeliveryService {
  constructor(private readonly parcelRepository: ParcelRepository) {}

  async changeStatus(
    id: number,
    nextStatus: DeliveryStatus,
  ): Promise<ParcelResponse> {
    const parcel = await this.parcelRepository.findById(id);
    if (!parcel) {
      throw new NotFoundException(ERROR_MESSAGE.PARCEL_NOT_FOUND);
    }

    const allowedNextStatuses = DELIVERY_STATUS_TRANSITIONS[parcel.status];
    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new ConflictException(ERROR_MESSAGE.STATUS_CHANGE_NOT_ALLOWED);
    }

    const updatedParcel = await this.parcelRepository.updateStatus(
      parcel,
      nextStatus,
    );
    return toParcelResponse(updatedParcel);
  }
}
