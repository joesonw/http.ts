import {Response } from '../entity/Response';
import {PostProcessor } from '../processor/PostProcessor';
import {ContentType } from '../util/ContentType';

export class JsonWriter extends PostProcessor {
	handle(response:Response) {
		let body = response.getExtra('body');
		if (body) {
			try {
				response.write(JSON.stringify(body));
				response.setContentType(ContentType.JSON);
			} catch (e) {

			}
		}
	}
}
