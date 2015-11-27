import Request from './Request'

abstract class PreProcessor {
	constructor() {
	}
	abstract handle(request:Request);
}

export default PreProcessor;