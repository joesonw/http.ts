import PreProcessor from '../processor/PreProcessor';
import Request from '../entity/Request';
import FilterException from '../exception/FilterException';

/// <reference path="../../typings/joi/joi.d.ts"/>
import * as joi from 'joi';

class FilterPreProcessor extends PreProcessor {
    private type:string = '';
    private schema:joi.Schema = null;
    constructor(type:string, schema:joi.Schema) {
        super();
        this.type = type;
        this.schema = schema;
    }
    handle(req:Request) {
        let candidate = {};
        if (this.type == 'query') {
            let tmp = req.getUrl().getQueries();
            for (let entry of tmp.entrySet()) {
                candidate[entry.key] = entry.value;
            }
        }
        try {
            joi.assert(candidate,this.schema);
        } catch(e) {
            throw new FilterException(e);
        }
    }
}

export default FilterPreProcessor;
