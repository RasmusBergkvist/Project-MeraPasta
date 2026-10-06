export interface Reservation {
    reservation_id?: number,
    customer_name: string,
    customer_email: string,
    customer_phonenumber: string,
    guests: number,
    reservation_date: string,
    reservation_time: string,
    message?: string

}
