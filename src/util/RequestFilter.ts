/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
/// <reference path="../_typings/joi/joi.d.ts"/>
import 'reflect-metadata';
import * as joi from 'joi';

import {Filter } from '../entity/Filter';
import {ReflectType } from '../util/ReflectType';



export namespace RequestFilter {
    export function Required() {

    }

    export function Optional(value:any) {

    }

    export function Allow(value:any) {

    }
    export function Min(value: number) {
        return (target: Filter, key: string) => {
            target.__metadata = target.__metadata || {};
            let type = Reflect.getMetadata(ReflectType.TYPE, target, key);
            let instance = target.__metadata[key] = target.__metadata[key];
            if (!instance) {
                if (type === Number) {
                    instance = joi.number();
                }
                instance = (<joi.NumberSchema> instance).min(value);
            }
            target.__metadata[key] = instance;
        }
    }
    export function Max(value:number) {

    }
    export function Length(value:number) {

    }
    export function Hex() {

    }
}
