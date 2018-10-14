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
import { property } from '@imqueue/rpc';

export class TimeTableOptions {
    /**
     * Start working time in minutes (relatively to the day start time)
     *
     * @type {number}
     */
    @property('number')
    public start: number = 0;

    /**
     * End working time in minutes (relatively to the day end time)
     *
     * @type {number}
     */
    @property('number')
    public end: number = 1440;

    /**
     * Max allowed reservations per customer per day
     *
     * @type {number}
     */
    @property('number')
    public maxReservations: 2;

    /**
     * Car washing patterns and their durations in minutes
     *
     * @type {{ [name: string]: number }}
     */
    @property('{ [name: string]: number }')
    public patterns: { [name: string]: number } = {
        fast: 30,
        standard: 45,
        full: 60
    };

    /**
     * Time zone for reservation time-table
     *
     * @type {string}
     */
    @property('string')
    public timezone: string = 'Europe/Kiev';
}
