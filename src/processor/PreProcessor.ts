import {Request } from '../entity/Request';

export abstract class PreProcessor {
	constructor() {
	}
	abstract handle(request:Request);
}
