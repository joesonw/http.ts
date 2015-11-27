import PreProcessor from '../processor/PreProcessor';
import Request from '../entity/Request';
import ContentType, {match } from '../util/ContentType';

class JsonReader extends PreProcessor {
	handle(request:Request) {
		let str = request.getBody();
		if (match(request.getHeader('Content-Type'),ContentType.JSON)) {
			try {
				let body = JSON.parse(str);
				request.setExtra('body',body);
			} catch (e) {
				console.log(e);
			}
		}
	}
}

export default JsonReader;