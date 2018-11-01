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

export class BaseTimeOption {
    /**
     * Time option key
     *
     * @type {string}
     */
    @property('string')
    public key: string;

    /**
     * Time options title
     *
     * @type {string}
     */
    @property('string')
    public title: string;

    /**
     * Time duration in minutes
     *
     * @type {number}
     */
    @property('number')
    public duration: number;
}

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
     * Base washing type configuration options
     *
     * @type {BaseTimeOption[]}
     */
    @property('BaseTimeOption[]')
    public baseTime: BaseTimeOption[] = [
        { key: 'fast', title: 'Fast washing', duration: 30 },
        { key: 'std', title: 'Standard washing', duration: 45 },
        { key: 'full', title: 'Full complex washing', duration: 60 },
    ];

    private baseTimeHash: { [key: string]: number };

    constructor() {
        this.baseTimeHash = this.baseTime.reduce(
            (hash: any, item: BaseTimeOption) => {
                hash[item.key] = item.duration;
                return hash;
            }, {});
    }
}
