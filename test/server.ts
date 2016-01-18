/// <reference path="../dist/index"/>
import * as httpts from '../dist/index';



let app:httpts.App = new httpts.App();

class TestFilter extends httpts.entity.Filter  {
	@httpts.util.RequestFilter.Min(10)
	public test:number;
}


@httpts.util.Route.Path('/test')
class IndexHandler extends httpts.entity.RouteHandler {

	@httpts.util.Route.SubPath('/:id')
	@httpts.util.Route.Method(httpts.util.HttpMethod.POST)
	@httpts.util.Route.PreFilter(new httpts.processor.JsonReader())
	@httpts.util.Route.QueryFilter(TestFilter)
	@httpts.util.Route.Produce(httpts.util.ContentType.JSON)
	@httpts.util.Route.PostFilter(new httpts.processor.JsonWriter())
	async getById(@httpts.util.Route.QueryParam('asd') asd:string, request:httpts.entity.Request, response:httpts.entity.Response,@httpts.util.Route.PathParam('id') id:string):Promise<string> {
		response.setHeader('x-test','yes');
		response.write('Hello world xxx');
		response.setExtra('body',{message: 'hello'});
		return '';
	}
}


let index = new IndexHandler();

app.setExceptionHandler((exception:httpts.exception.Exception, response:httpts.entity.Response) => {
	console.error(exception.getStack());
	console.error(exception.getMessage());
	response.write('Custom Exception Handler:' + exception.getMessage());
	if (exception instanceof httpts.exception.NotFoundException) {
		response.setStatus(httpts.util.HttpStatus.NOT_FOUND);
	} else if (exception instanceof httpts.exception.FilterException) {
		console.error(exception.getExtra('detail'));
		response.setStatus(httpts.util.HttpStatus.NOT_PROCESSABLE);
	}

	response.flush();
});
app.register(index);
module.exports = app;
