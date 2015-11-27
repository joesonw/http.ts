import Request from '../entity/Request';

abstract class PreProcessor {
	constructor() {
	}
	abstract handle(request:Request);
}

export default PreProcessor;