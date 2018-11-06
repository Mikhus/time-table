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
import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';
import { initModels, Reservation } from '..';

/**
 * Initial database setup - creates all initial tables and indexes
 * during the first application setup
 *
 * @param {QueryInterface} migration
 * @return {Promise<void>}
 */
export async function up(migration: QueryInterface) {
    try {
        initModels();

        const description: any = await migration.describeTable(
            Reservation.name,
        );

        if (!description.reserveDate) {
            await migration.addColumn(
                Reservation.name,
                'reserveDate',
                {
                    type: DataType.DATEONLY,
                    allowNull: false,
                    defaultValue: DataType.NOW,
                },
            );
        }

        await migration.sequelize.query(`CREATE UNIQUE INDEX
            car_duplicate_idx ON "${Reservation.name}"
            ("carId", "reserveDate", COALESCE("deletedAt", '1970-01-01'))`
        );
    } catch (err) {
        await down(migration);
        throw err;
    }
}

/**
 * Drops everything from a database making it empty again
 *
 * @param {QueryInterface} migration
 * @return {Promise<void>}
 */
export async function down(migration: QueryInterface) {
    await migration.removeColumn(Reservation.name, 'reserveDate');
    await migration.removeIndex(Reservation.name, 'car_duplicate_idx');
    console.log('Reservation: addition of "reserveDate" column reverted!');
}
