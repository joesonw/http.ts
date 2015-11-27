import PreProcessor from '../PreProcessor';
import Request from '../Request';

class JsonReader extends PreProcessor {
	handle(request:Request) {
		let str = request.getBody();
		try {
			let body = JSON.parse(str);
			request.setExtra('body',body);
		} catch (e) {
			console.log(e);
		}
	}
}

export default JsonReader;