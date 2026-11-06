export interface Reservation {
  id: number;
  time: string;
  trainerId: number;
}

const TRAINER_IDS = [1, 2];

export class ReservationRepository {
  private readonly reservations: Reservation[] = [
    { id: 1, time: "19:00", trainerId: 1 },
  ];

  async findById(id: number): Promise<Reservation | undefined> {
    return this.reservations.find((reservation) => reservation.id === id);
  }

  async create(time: string, trainerId: number): Promise<Reservation> {
    const sameTimeReservation = this.reservations.find(
      (reservation) =>
        reservation.time === time && reservation.trainerId === trainerId,
    );
    if (sameTimeReservation) {
      throw Object.assign(
        new Error(
          'duplicate key value violates unique constraint "Reservation_trainerId_time_key"',
        ),
        { sqlState: "23505" },
      );
    }

    if (!TRAINER_IDS.includes(trainerId)) {
      throw Object.assign(
        new Error(
          'insert or update on table "Reservation" violates foreign key constraint "Reservation_trainerId_fkey"',
        ),
        { sqlState: "23503" },
      );
    }

    const reservation = { id: this.reservations.length + 1, time, trainerId };
    this.reservations.push(reservation);
    return reservation;
  }
}
