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
import * as fs from 'fs';
import { resolve, sep } from 'path';
import { Sequelize } from 'sequelize-typescript';
import { parse, Url } from 'url';
import {
    SequelizeConfig,
} from 'sequelize-typescript/lib/types/SequelizeConfig';
import {
    DEFAULT_DB_DIALECT,
    DEFAULT_DB_NAME,
    DEFAULT_DB_PASS,
    DEFAULT_DB_USER,
    DEFAULT_DB_HOST,
    DEFAULT_DB_PORT,
} from '../../config';
import { dbConfig, serviceOptions } from '../../config';

export * from './BaseModel';
export * from './models/Reservation';

const JS_EXT_RX = /\.js$/;
const logger = serviceOptions.logger || console;

/**
 * Parses given database connection string into a SequelizeConfig
 *
 * @param {string} str
 * @return {SequelizeConfig}
 */
export function parseConnectionString(str: string): SequelizeConfig {
    let url: Url = parse(str);
    let [user, pass] = (url.auth || '').split(/:/);

    return {
        name: (url.pathname || '').split(/\/|\\\\/)[1] || DEFAULT_DB_NAME,
        dialect: (url.protocol || DEFAULT_DB_DIALECT).replace(/:/g, ''),
        host: url.hostname || DEFAULT_DB_HOST,
        port: Number(url.port) || DEFAULT_DB_PORT,
        username: user || DEFAULT_DB_USER,
        password: pass || DEFAULT_DB_PASS,
        storage: ':memory:',
    };
}

/**
 * Returns all files list from a given directory
 *
 * @param {string} dir
 * @return {string[]}
 */
function walk(dir: string) {
    let results: string[] = [];

    for (let file of fs.readdirSync(dir)) {
        file = resolve(dir, file);

        const stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        }

        else {
            results.push(file);
        }
    }

    return results;
}

/**
 * Initialized all known by this package database models and
 * returns instance of Sequelize, mapped with these models
 *
 * @param {boolean} [logging] - force logging option on Sequelize construction
 * @return {Sequelize}
 */
export function initModels(logging?: boolean): Sequelize {
    const config = dbConfig;

    if (config.url) {
        Object.assign(config, parseConnectionString(dbConfig.url));
    }

    if (logging !== undefined) {
        config.logging = !!logging;
    }

    const orm = new Sequelize(config);

    orm.addModels(walk(resolve(__dirname, 'models'))
        .filter(name => JS_EXT_RX.test(name))
        .map(filename => require(filename)[
            filename.split(sep)
                .reverse()[0]
                .replace(JS_EXT_RX, '')
            ]));

    logger.log('Database models initialized...');

    return orm;
}
