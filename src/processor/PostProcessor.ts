import Response from '../entity/Response'

abstract class PostProcessor {
	constructor() {
	}
	abstract handle(response:Response);
}
export default PostProcessor;
