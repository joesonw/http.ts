import {Response } from '../entity/Response'

export abstract class PostProcessor {
	constructor() {
	}
	abstract handle(response:Response);
}
