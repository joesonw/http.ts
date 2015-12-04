/// <reference path="../_typings/joi/joi.d.ts"/>
import * as joi from 'joi';

export abstract class Filter {
    public __metadata: { [key: string]: joi.Schema};
}
