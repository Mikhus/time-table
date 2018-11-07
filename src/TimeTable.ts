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
import { Sequelize } from 'sequelize-typescript';
import { Reservation, TimeTableOptions, initModels } from '.';
import { today, tomorrow } from './lib';

const Op = Sequelize.Op;

export class TimeTable extends IMQService {

    /**
     * @constructor
     * @param {Partial<IMQServiceOptions>} options
     * @param {string} name
     */
    public constructor(options?: Partial<IMQServiceOptions>, name?: string) {
        super(options, name);
        initModels();
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
        const dateObj = date ? new Date(date) : new Date();

        return await Reservation.findAll({
            where: { [Op.and]: [
                { duration: { [Op.contained]: [
                    today(dateObj),
                    tomorrow(dateObj),
                ]}},
                { deletedAt: null },
            ]},
            attributes: fields,
        });
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
        return await Reservation.findById(id, { attributes: fields });
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

        try {
            const reservation = new Reservation(
                { carId, userId, type, duration } as Reservation
            );

            await reservation.save();

            return await this.list(duration[0].toISOString(), fields);
        } catch (err) {
            if (err.original && err.original.code === '23505') {
                throw new Error('Time for given car has been already ' +
                    'reserved at this date!');
            }

            throw err;
        }
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
        const reservation = await this.fetch(id);

        if (!reservation) {
            throw new Error('No such reservation found!');
        }

        await Reservation.destroy({ where: { id } });

        return this.list(
            (reservation.duration as [Date, Date])[0].toISOString(),
            fields,
        );
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
