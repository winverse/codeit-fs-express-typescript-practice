import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  HttpException,
  NotFoundException,
} from "./exceptions.js";

// TODO 1: 배열을 as const로 고정하고, typeof로 얻은 배열 타입에 [number]로 접근해 DeliveryStatus 타입을 만드세요.
export const DELIVERY_STATUSES = [
  "ordered",
  "packed",
  "shipping",
  "delivered",
  "canceled",
];

export type DeliveryStatus = string;

// TODO 2: 상태마다 바꿀 수 있는 다음 상태를 Record<DeliveryStatus, readonly DeliveryStatus[]> 타입의 표로 만드세요.
// ordered → packed·canceled, packed → shipping·canceled, shipping → delivered, delivered·canceled → 없음
export const DELIVERY_STATUS_TRANSITIONS = {};

// TODO 3: HttpException을 상속해 상태 코드 HTTP_STATUS.CONFLICT(409)를 갖는 ConflictException을 만드세요.

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

// TODO 4: parcel을 ParcelResponse로 바꾸세요. allowedNextStatuses에는 표에서 현재 상태의 다음 상태 목록을 담습니다.
export function toParcelResponse(parcel: Parcel): ParcelResponse {}

export class DeliveryService {
  // TODO 5: ParcelRepository를 private readonly 생성자 매개변수 프로퍼티로 받으세요.

  // TODO 6: id로 택배를 찾아 없으면 NotFoundException을, 표가 허용하지 않는 다음 상태면 ConflictException을 던지세요.
  // 허용되면 상태를 바꾼 택배를 ParcelResponse로 바꿔 반환하세요. 오류 메시지는 ERROR_MESSAGE에서 고릅니다.
  async changeStatus(
    id: number,
    nextStatus: DeliveryStatus,
  ): Promise<ParcelResponse> {}
}
