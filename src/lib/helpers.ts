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

/**
 * Returns start time of a given data treating the given date as "today",
 * if date is not given will use real today date
 *
 * @param {Date} date
 * @return {Date}
 */
export function today(date = new Date()) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0, 0, 0, 0,
    );
}

/**
 * Returns "tomorrow" value for a given date which is start time of the
 * date after the given date. If date is not given will return real
 * tomorrow start time value
 *
 * @param {Date} date
 * @return {Date}
 */
export function tomorrow(date = new Date()) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
        0, 0, 0, 0,
    );
}
