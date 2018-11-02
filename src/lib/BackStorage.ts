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
import { profile } from '@imqueue/rpc';
import { createHandyClient, IHandyRedis } from 'handy-redis';
import { Sequelize } from 'sequelize-typescript';
import { initModels, Reservation } from '../orm';
import { REDIS_STORE_HOST, REDIS_STORE_PORT } from '../../config';
import { today, tomorrow } from '../lib';

const Op = Sequelize.Op;

export class BackStorage {
    private redis: IHandyRedis;
    private orm: Sequelize;

    public constructor() {
        this.orm = initModels();
        this.redis = createHandyClient(
            REDIS_STORE_PORT,
            REDIS_STORE_HOST,
        );
    }

    @profile()
    public async init(date = new Date()) {
        const list = await this.list(date);
        // TODO: put data into redis store

    }

    @profile()
    public async list(
        date = new Date(),
        fields?: string[],
    ): Promise<Reservation[]> {
        return await Reservation.findAll({
            where: { [Op.and]: [
                { duration: { [Op.contained]: [today(date), tomorrow(date)] } },
                { deletedAt: null },
            ]},
            attributes: fields,
        });
    }

    @profile()
    public async findById(id: string, fields?: string[]) {
        return await Reservation.findById(id, { attributes: fields });
    }

    @profile()
    public async add() {

    }

    @profile()
    public async cancel() {

    }
}
