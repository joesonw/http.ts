var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
/// <reference path="../dist/index"/>
var httpts = require('../dist/index');
let app = new httpts.App();
class TestFilter extends httpts.entity.Filter {
}
__decorate([
    httpts.util.RequestFilter.Min(10), 
    __metadata('design:type', Number)
], TestFilter.prototype, "test", void 0);
let IndexHandler = class extends httpts.entity.RouteHandler {
    getById(asd, request, response, id) {
        return __awaiter(this, void 0, Promise, function* () {
            response.setHeader('x-test', 'yes');
            response.write('Hello world xxx');
            response.setExtra('body', { message: 'hello' });
            return '';
        });
    }
};
__decorate([
    httpts.util.Route.SubPath('/:id'),
    httpts.util.Route.Method(httpts.util.HttpMethod.POST),
    httpts.util.Route.PreFilter(new httpts.processor.JsonReader()),
    httpts.util.Route.QueryFilter(TestFilter),
    httpts.util.Route.Produce(httpts.util.ContentType.JSON),
    httpts.util.Route.PostFilter(new httpts.processor.JsonWriter()),
    __param(0, httpts.util.Route.QueryParam('asd')),
    __param(3, httpts.util.Route.PathParam('id')), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [String, httpts.entity.Request, httpts.entity.Response, String]), 
    __metadata('design:returntype', Promise)
], IndexHandler.prototype, "getById", null);
IndexHandler = __decorate([
    httpts.util.Route.Path('/test'), 
    __metadata('design:paramtypes', [])
], IndexHandler);
let index = new IndexHandler();
app.setExceptionHandler((exception, response) => {
    console.error(exception.getStack());
    console.error(exception.getMessage());
    response.write('Custom Exception Handler:' + exception.getMessage());
    if (exception instanceof httpts.exception.NotFoundException) {
        response.setStatus(httpts.util.HttpStatus.NOT_FOUND);
    }
    else if (exception instanceof httpts.exception.FilterException) {
        console.error(exception.getExtra('detail'));
        response.setStatus(httpts.util.HttpStatus.NOT_PROCESSABLE);
    }
    response.flush();
});
app.register(index);
module.exports = app;
