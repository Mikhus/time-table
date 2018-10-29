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
import { Model } from 'sequelize-typescript';

const toJSON = Model.prototype.toJSON;

/**
 * Base Model class extended
 */
export class BaseModel<T> extends Model<BaseModel<T>> {

    /**
     * Serializes this model instance to JSON
     */
    public toJSON(): any {
        const serialized: any = toJSON.call(this);
        const props = Object.keys(this);

        for (let i = 0; i < props.length; i++) {
            this.verifyProperty(props[i], serialized);
        }

        return serialized;
    }

    private verifyProperty(prop: string, serialized: any) {
        const val = (this as any)[prop];

        if (!serialized[prop] && val !== this && val instanceof Model) {
            serialized[prop] = toJSON.call(val);
        }

        if (val instanceof Array) {
            this.verifyArray(val, prop, serialized);
        }
    }

    private verifyArray(arr: any[], prop: string, serialized: any) {
        for (let i = 0; i < arr.length; i++) {
            const val = (this as any)[prop][i];

            if (val instanceof Model) {
                serialized[prop][i] = toJSON.call(val);
            }

            serialized[prop][i] = val && val.toJSON
                ? val.toJSON()
                : JSON.parse(JSON.stringify(val));
        }
    }
}