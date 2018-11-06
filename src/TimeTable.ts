/*!
 * ISC License
 * 
 * Copyright (c) 2018, Imqueue Sandbox
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
import { IMQService, expose, profile, IMQServiceOptions } from '@imqueue/rpc';
import * as moment from 'moment';
import 'moment-timezone';
import { Reservation, TimeTableOptions } from '.';
import { BackStorage } from './lib';

export class TimeTable extends IMQService {

    /**
     * ORM database driver associated with the service
     *
     * @type {Sequelize}
     */
    private storage: BackStorage;

    public constructor(options?: Partial<IMQServiceOptions>, name?: string) {
        super(options, name);
        this.storage = new BackStorage(this.logger);
    }

    /**
     * Returns a list of reservations starting from a given time (or from
     * current time if omitted)
     *
     * @param {string} [date] - date to select reservations for, if not passed current date is used
     * @param {string[]} [fields] - fields to select for reservations data list
     * @return {Promise<Reservation[]>} - list of found reservations
     */
    @profile()
    @expose()
    public async list(
        date?: string,
        fields?: string[]
    ): Promise<Reservation[]> {
        return await this.storage.list(
            date ? new Date(date) : new Date(),
            fields,
        );
    }

    /**
     * Fetches and returns single reservation record by its identifier
     *
     * @param {string} id - reservation identifier to fetch
     * @param {string[]} [fields] - fields to select for reservation data object
     * @return {Promise<Reservation | null>} - reservation data object or null if not found
     */
    @profile()
    @expose()
    public async fetch(
        id: string,
        fields?: string[],
    ): Promise<Partial<Reservation> | null> {
        return await this.storage.findById(id, fields);
    }

    /**
     * Makes a given reservation or throws a proper error
     * if action is not possible
     *
     * @param {Reservation} reservation - reservation data structure
     * @param {string[]} [fields] - fields to select for updated reservations list
     * @return {Promise<Reservation[]>} - updated reservations list
     */
    @profile()
    @expose()
    public async reserve(
        reservation: Reservation,
        fields?: string[],
    ): Promise<Reservation[]> {
        const { carId, userId, type } = reservation;
        const duration: [Date, Date] = [
            moment.parseZone(reservation.duration[0]).toDate(),
            moment.parseZone(reservation.duration[1]).toDate(),
        ];

        return await this.storage.add(
            carId,
            userId,
            type,
            duration,
            fields,
        );
    }

    /**
     * Cancels reservation at a given time
     *
     * @param {string} id - reservation identifier
     * @param {string[]} [fields] - fields to select for updated reservations list
     * @return {Promise<Reservation[]>} - updated reservations list
     */
    @profile()
    @expose()
    public async cancel(id: string, fields?: string[]): Promise<Reservation[]> {
        return await this.storage.remove(id, fields);
    }

    /**
     * Returns reservation time-table configuration settings
     *
     * @return {Promise<TimeTableOptions>} - reservations time-table options
     */
    @profile()
    @expose()
    public async config(): Promise<TimeTableOptions> {
        const options = new TimeTableOptions();
        delete (options as any).baseTimeHash;

        return options;
    }
}
