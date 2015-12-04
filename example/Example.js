/// <reference path="../node_modules/httpts/dist/index.d.ts" />
var httpts = require('httpts');
console.log(httpts);
/*
let app:httpts.App = new httpts.App();

app.listen(8080);
*/
/*

class TestFilter extends Filter  {
    @RequestFilter.Min(10)
    public test:number;
}



@Route.Path('/test')
class IndexHandler extends RouteHandler {

    @Route.SubPath('/:id')
    @Route.Method(HttpMethod.POST)
    @Route.PreFilter(new JsonReader())
    @Route.QueryFilter(TestFilter)
    @Route.Produce(ContentType.JSON)
    @Route.PostFilter(new JsonWriter())
    async getById(@Route.QueryParam('asd') asd:string, request:Request, response:Response,@Route.PathParam('id') id:string):Promise<string> {
        response.setHeader('x-test','yes');
        response.write('Hello world xxx');
        response.setExtra('body',{message: 'hello'});
        return '';
    }
}


let index = new IndexHandler();

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
*/ 
//# sourceMappingURL=Example.js.map