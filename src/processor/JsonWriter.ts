import Response from '../Response';
import PostProcessor from '../PostProcessor';
import ContentType from '../ContentType';

class JsonWriter extends PostProcessor {
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

export default JsonWriter;