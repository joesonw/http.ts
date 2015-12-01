import App from './App';
import HttpMethod from './util/HttpMethod';
import * as Route from './util/Route';
import RouteHandler from './entity/RouteHandler';
import JsonReader from './processor/JsonReader';
import JsonWriter from './processor/JsonWriter';
import Exception from './exception/Exception';
import ContentType from './util/ContentType';
import NotFoundException from './exception/NotFoundException';
import FilterException from './exception/FilterException';
import HttpStatus from './util/HttpStatus';
import Filter from './entity/Filter';
import * as RequestFilter from './util/RequestFilter';
//import Serializable, {MapKey } from './entity/Serializable

import Url from './entity/Url';
import Request from './entity/Request';
import Response from './entity/Response';



let app:App = new App();

class TestFilter extends Filter  {
	@RequestFilter.Min(10)
	public test:number;
}

@Route.Path('/test')
class IndexHandler extends RouteHandler {

	@Route.SubPath('/:id')
	@Route.Method(HttpMethod.POST)
	@Route.QueryFilter(TestFilter)
	@Route.Produce(ContentType.JSON)
	@Route.PostFilter(new JsonWriter())
	async getById(@Route.QueryParam('asd') asd:string, request:Request, response:Response,@Route.PathParam('id') id:string):Promise<string> {
		//console.log(request.getUrl());
		//console.log(request.getBody());
		//console.log(request.getExtra('body'));
		//console.log(id);
		//console.log(asd);
		response.setHeader('x-test','yes');
		response.write('Hello world xxx');
		response.setExtra('body',{message: 'hello'});
		return '';
	}
}


let index = new IndexHandler();
index.add(new JsonReader());
//index.addLast(new JsonWriter());

app.setExceptionHandler((exception:Exception, response:Response) => {
	console.error(exception.getStack());
	console.error(exception.getMessage());
	response.write('Custom Exception Handler:' + exception.getMessage());
	if (exception instanceof NotFoundException) {
		response.setStatus(HttpStatus.NOT_FOUND);
	} else if (exception instanceof FilterException) {
		console.error(exception.getExtra('detail'));
		response.setStatus(HttpStatus.NOT_PROCESSABLE);
	}

	response.flush();
});
app.register(index);


app.listen(8080);
console.log('started on 8080');
