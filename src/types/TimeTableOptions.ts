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
    @property('string')
    public start: string = '08:00';

    /**
     * End working time in minutes (relatively to the day end time)
     *
     * @type {number}
     */
    @property('string')
    public end: string = '21:00';

    /**
     * Max allowed reservations per customer per day
     *
     * @type {number}
     */
    @property('number')
    public boxes: 4;

    /**
     * Car washing patterns and their durations in minutes
     *
     * @type {{ [name: string]: number }}
     */
    @property('{ [name: string]: { title: string, duration: number } }')
    public baseTime: { [name: string]: { title: string, duration: number } } = {
        fast: { title: 'Fast washing', duration: 30 },
        std: { title: 'Standard washing', duration: 45 },
        full: { title: 'Full complex washing', duration: 60 },
    };

    /**
     * Time additions for different factor types
     *
     * @type {{ [appendType: string]: { [key: string]: number } }}
     */
    @property('{ [appendType: string]: { [key: string]: number } }')
    public appendTime: { [appendType: string]: { [key: string]: number } } = {
        carType: {
            mini: -5,
            midsize: 0,
            large: 15,
        },
    };
}
