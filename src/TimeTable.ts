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
import { IMQService, expose, profile } from '@imqueue/rpc';
import { Reservation, TimeTableOptions } from '.';
import { BackStorage } from './lib';
export class TimeTable extends IMQService {

    /**
     * ORM database driver associated with the service
     *
     * @type {Sequelize}
     */
    private storage: BackStorage = new BackStorage();

    /**
     * Returns a list of reservations starting from a given time (or from
     * current time if omitted)
     *
     * @param {string} startFrom
     * @return {Promise<Reservation[]>}
     */
    @profile()
    @expose()
    public async list(startFrom?: string): Promise<Reservation[]> {
        // TODO: implement
        return [];
    }

    /**
     * Makes a given reservation or throws a proper error
     * if action is not possible
     *
     * @param {Reservation} reservation
     * @return {Promise<boolean>}
     */
    @profile()
    @expose()
    public async reserve(reservation: Reservation): Promise<boolean> {
        // TODO: implement
        return true;
    }

    /**
     * Cancels reservation at a given time
     *
     * @param {string} reservationTime
     * @return {Promise<boolean>}
     */
    @profile()
    @expose()
    public async cancel(reservationTime: string): Promise<boolean> {
        // TODO: implement
        return true;
    }

    /**
     * Returns closes possible reservation for a selected washing type
     * and a given startTime
     *
     * @param {string} washingType
     * @param {string} startFrom
     * @return {Promise<Reservation | null>}
     */
    @profile()
    @expose()
    public async closest(
        washingType: string,
        startFrom: string
    ): Promise<Reservation|null> {
        // TODO: implement
        return null;
    }

    /**
     * Returns reservation time-table configuration settings
     *
     * @return {Promise<TimeTableOptions>}
     */
    @profile()
    @expose()
    public async config(): Promise<TimeTableOptions> {
        const options = new TimeTableOptions();
        delete (options as any).baseTimeHash;

        return options;
    }
}
