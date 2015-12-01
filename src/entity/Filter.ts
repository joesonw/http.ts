/// <reference path="../../typings/joi/joi.d.ts"/>
import * as joi from 'joi';

abstract class Filter {
    public __metadata: { [key: string]: joi.Schema};
}

export default Filter;
