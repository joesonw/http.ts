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
System.register("util/Map", [], function(exports_1) {
    "use strict";
    var Map;
    return {
        setters:[],
        execute: function() {
            class Map {
                constructor(source) {
                    this.data = {};
                    if (source) {
                        for (let entry of source.entrySet()) {
                            this.data[entry.key] = entry.value;
                        }
                    }
                }
                set(key, value) {
                    this.data[key] = value;
                }
                get(key) {
                    return this.data[key] || null;
                }
                remove(key) {
                    let ret = this.data[key];
                    delete this.data[key];
                    return ret || null;
                }
                has(key) {
                    return (key in this.data);
                }
                entrySet() {
                    let ret = [];
                    for (let key in this.data) {
                        ret.push({ key: key, value: this.data[key] });
                    }
                    return ret;
                }
                iterator() {
                    let keys = Object.keys(this.data);
                    if (keys.length == 0) {
                        return null;
                    }
                    let ret = {
                        key: keys[0],
                        value: this.data[keys[0]],
                        next: null
                    };
                    let cursor = ret;
                    for (let i = 1; i < keys.length; i++) {
                        let item = {
                            key: keys[i],
                            value: this.data[keys[i]],
                            next: null
                        };
                        cursor.next = item;
                        cursor = item;
                    }
                    return ret;
                }
            }
            exports_1("default",Map);
        }
    }
});
System.register("util/HttpMethod", [], function(exports_2) {
    "use strict";
    var HttpMethod;
    return {
        setters:[],
        execute: function() {
            (function (HttpMethod) {
                HttpMethod[HttpMethod["GET"] = 0] = "GET";
                HttpMethod[HttpMethod["POST"] = 1] = "POST";
                HttpMethod[HttpMethod["PUT"] = 2] = "PUT";
                HttpMethod[HttpMethod["DELETE"] = 3] = "DELETE";
                HttpMethod[HttpMethod["PATCH"] = 4] = "PATCH";
            })(HttpMethod || (HttpMethod = {}));
            ;
            exports_2("default",HttpMethod);
        }
    }
});
System.register("entity/Url", ["util/Map"], function(exports_3) {
    "use strict";
    var Map_1;
    var PATH_REGEXP, Url;
    function parse(str) {
        var tokens = [];
        var key = 0;
        var index = 0;
        var path = '';
        var res;
        while ((res = PATH_REGEXP.exec(str)) != null) {
            var m = res[0];
            var escaped = res[1];
            var offset = res.index;
            path += str.slice(index, offset);
            index = offset + m.length;
            // Ignore already escaped sequences.
            if (escaped) {
                path += escaped[1];
                continue;
            }
            // Push the current path onto the tokens.
            if (path) {
                tokens.push(path);
                path = '';
            }
            var prefix = res[2];
            var name = res[3];
            var capture = res[4];
            var group = res[5];
            var suffix = res[6];
            var asterisk = res[7];
            var repeat = suffix === '+' || suffix === '*';
            var optional = suffix === '?' || suffix === '*';
            var delimiter = prefix || '/';
            var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');
            tokens.push({
                name: name || key++,
                prefix: prefix || '',
                delimiter: delimiter,
                optional: optional,
                repeat: repeat,
                pattern: pattern.replace(/([=!:$\/()])/g, '\\$1')
            });
        }
        // Match any characters still remaining.
        if (index < str.length) {
            path += str.substr(index);
        }
        // If the path exists, push it onto the end.
        if (path) {
            tokens.push(path);
        }
        return tokens;
    }
    function tokensToRegExp(tokens, options) {
        options = options || {};
        var strict = options.strict;
        var end = options.end !== false;
        var route = '';
        var lastToken = tokens[tokens.length - 1];
        var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);
        // Iterate over the tokens and create our regexp string.
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === 'string') {
                route += token.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1');
            }
            else {
                var prefix = token.prefix.replace((/([.+*?=^!:${}()[\]|\/])/g, '\\$1'));
                var capture = token.pattern;
                if (token.repeat) {
                    capture += '(?:' + prefix + capture + ')*';
                }
                if (token.optional) {
                    if (prefix) {
                        capture = '(?:' + prefix + '(' + capture + '))?';
                    }
                    else {
                        capture = '(' + capture + ')?';
                    }
                }
                else {
                    capture = prefix + '(' + capture + ')';
                }
                route += capture;
            }
        }
        // In non-strict mode we allow a slash at the end of match. If the path to
        // match already ends with a slash, we remove it for consistency. The slash
        // is valid at the end of a path match, not in the middle. This is important
        // in non-ending mode, where "/test/" shouldn't match "/test//route".
        if (!strict) {
            route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
        }
        if (end) {
            route += '$';
        }
        else {
            // In non-ending mode, we need the capturing groups to match as much as
            // possible by using a positive lookahead to the end or next path segment.
            route += strict && endsWithSlash ? '' : '(?=\\/|$)';
        }
        return new RegExp('^' + route, options.sensitive ? '' : 'i');
    }
    return {
        setters:[
            function (Map_1_1) {
                Map_1 = Map_1_1;
            }],
        execute: function() {
            PATH_REGEXP = new RegExp([
                '(\\\\.)',
                '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
            ].join('|'), 'g');
            class Url {
                constructor(path, params, query) {
                    this.path = path || '';
                    this.params = params || new Map_1.default();
                    this.query = query || new Map_1.default();
                }
                getParams() {
                    return new Map_1.default(this.params);
                }
                getParam(key) {
                    return this.params.get(key);
                }
                getQueries() {
                    return new Map_1.default(this.query);
                }
                getQuery(key) {
                    return this.query.get(key);
                }
                static match(url, pattern) {
                    let tokens = parse(pattern);
                    let re = tokensToRegExp(tokens, {});
                    let keys = [];
                    for (let i = 0; i < tokens.length; i++) {
                        if (typeof tokens[i] !== 'string') {
                            keys.push(tokens[i]);
                        }
                    }
                    let params = new Map_1.default();
                    let result = re.exec(url);
                    return !!result;
                }
                static parse(url, pattern) {
                    let path = url.split('?')[0];
                    let queryString = url.split('?')[1];
                    let tokens = parse(pattern);
                    let re = tokensToRegExp(tokens, {});
                    let keys = [];
                    for (let i = 0; i < tokens.length; i++) {
                        if (typeof tokens[i] !== 'string') {
                            keys.push(tokens[i]);
                        }
                    }
                    let params = new Map_1.default();
                    let result = re.exec(path);
                    for (let i = 0; i < keys.length; i++) {
                        params.set(keys[i].name, result[i + 1]);
                    }
                    let query = new Map_1.default();
                    if (queryString) {
                        let queryArr = queryString.split('&');
                        for (let q of queryArr) {
                            let t = q.split('=');
                            query.set(t[0], t[1]);
                        }
                    }
                    return new Url(path, params, query);
                }
            }
            exports_3("default", Url);
        }
    }
});
System.register("entity/Request", ["util/Map", "util/HttpMethod"], function(exports_4) {
    "use strict";
    var Map_2, HttpMethod_1;
    var Request;
    return {
        setters:[
            function (Map_2_1) {
                Map_2 = Map_2_1;
            },
            function (HttpMethod_1_1) {
                HttpMethod_1 = HttpMethod_1_1;
            }],
        execute: function() {
            class Request {
                constructor(request, url, body) {
                    this.extra = new Map_2.default();
                    this.headers = new Map_2.default();
                    this.httpMethod = null;
                    this.request = request;
                    this.body = body;
                    this.url = url;
                    let headers = request.headers || {};
                    for (let key in headers) {
                        this.headers.set(key, headers[key]);
                    }
                    this.httpVersion = request.httpVersion;
                    switch (request.method.toUpperCase()) {
                        case 'GET':
                            this.httpMethod = HttpMethod_1.default.GET;
                            break;
                        case 'POST':
                            this.httpMethod = HttpMethod_1.default.POST;
                            break;
                        case 'PUT':
                            this.httpMethod = HttpMethod_1.default.PUT;
                            break;
                        case 'DELETE':
                            this.httpMethod = HttpMethod_1.default.DELETE;
                            break;
                        case 'PATCH':
                            this.httpMethod = HttpMethod_1.default.PATCH;
                            break;
                    }
                }
                /**
                 * Get all HTTP headers
                 */
                getHeaders() {
                    return new Map_2.default(this.headers);
                }
                /**
                 * Get HTTP header by key
                 * @param header name to get
                 */
                getHeader(key) {
                    return this.headers.get(key.toLowerCase()) || '';
                }
                /**
             // 	 * Get http version
                 */
                getVersion() {
                    return this.httpVersion;
                }
                getMethod() {
                    return this.httpMethod;
                }
                getUrl() {
                    return this.url;
                }
                getBody() {
                    return this.body;
                }
                setExtra(key, value) {
                    this.extra.set(key, value);
                }
                getExtra(key) {
                    return this.extra.get(key);
                }
            }
            exports_4("default",Request);
        }
    }
});
System.register("exception/Exception", ["util/Map"], function(exports_5) {
    "use strict";
    var Map_3;
    var Exception;
    return {
        setters:[
            function (Map_3_1) {
                Map_3 = Map_3_1;
            }],
        execute: function() {
            class Exception {
                constructor(message, e) {
                    this.extra = new Map_3.default();
                    this.message = message;
                    if (e) {
                        this.stack = e.stack;
                    }
                    else {
                        this.stack = new Error().stack;
                    }
                }
                getStack() {
                    return this.stack;
                }
                getMessage() {
                    return this.message;
                }
                setExtra(key, value) {
                    this.extra.set(key, value);
                }
                getExtra(key) {
                    return this.extra.get(key);
                }
            }
            exports_5("default",Exception);
        }
    }
});
System.register("exception/NotFoundException", ["exception/Exception"], function(exports_6) {
    "use strict";
    var Exception_1;
    var NotFoundException;
    return {
        setters:[
            function (Exception_1_1) {
                Exception_1 = Exception_1_1;
            }],
        execute: function() {
            class NotFoundException extends Exception_1.default {
                constructor() {
                    super('The requested uri is not found');
                }
            }
            exports_6("default", NotFoundException);
        }
    }
});
System.register("util/ContentType", [], function(exports_7) {
    "use strict";
    var ContentType, JSON_string;
    return {
        setters:[],
        execute: function() {
            (function (ContentType) {
                ContentType[ContentType["JSON"] = 0] = "JSON";
                ContentType[ContentType["TEXT"] = 1] = "TEXT";
                ContentType[ContentType["HTML"] = 2] = "HTML";
            })(ContentType || (ContentType = {}));
            JSON_string = ['application/json'];
            (function (ContentType) {
                function match(header, type) {
                    switch (type) {
                        case ContentType.JSON:
                            if (JSON_string.indexOf(header) !== -1)
                                return true;
                    }
                    return false;
                }
                ContentType.match = match;
            })(ContentType || (ContentType = {}));
            exports_7("default",ContentType);
        }
    }
});
System.register("util/HttpStatus", [], function(exports_8) {
    "use strict";
    var HttpStatus;
    return {
        setters:[],
        execute: function() {
            (function (HttpStatus) {
                HttpStatus[HttpStatus["OK"] = 200] = "OK";
                HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
                HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
                HttpStatus[HttpStatus["NOT_PROCESSABLE"] = 422] = "NOT_PROCESSABLE";
            })(HttpStatus || (HttpStatus = {}));
            ;
            exports_8("default",HttpStatus);
        }
    }
});
System.register("entity/Response", ["util/ContentType", "util/HttpStatus", "util/Map"], function(exports_9) {
    "use strict";
    var ContentType_1, HttpStatus_1, Map_4;
    var Response;
    return {
        setters:[
            function (ContentType_1_1) {
                ContentType_1 = ContentType_1_1;
            },
            function (HttpStatus_1_1) {
                HttpStatus_1 = HttpStatus_1_1;
            },
            function (Map_4_1) {
                Map_4 = Map_4_1;
            }],
        execute: function() {
            class Response {
                constructor(response) {
                    this.buffer = '';
                    this.status = HttpStatus_1.default.OK;
                    this.headers = new Map_4.default();
                    this.contentType = ContentType_1.default.TEXT;
                    this.flushed = false;
                    this.extra = new Map_4.default();
                    this.response = response;
                }
                write(data) {
                    this.buffer = data;
                }
                append(data) {
                    this.buffer += data;
                }
                setStatus(status) {
                    this.status = status;
                }
                getStatus() {
                    return this.status;
                }
                setContentType(type) {
                    this.contentType = type;
                }
                getContentType() {
                    return this.contentType;
                }
                getHeaders() {
                    return new Map_4.default(this.headers);
                }
                getHeader(key) {
                    return this.headers.get(key);
                }
                setHeaders(headers) {
                    this.headers = headers;
                }
                setHeader(key, value) {
                    this.headers.set(key, value);
                }
                flush() {
                    if (this.flushed)
                        return;
                    let contentType = this.parseContentType();
                    let headers = {};
                    headers['Content-Type'] = contentType;
                    for (let header of this.headers.entrySet()) {
                        headers[header.key] = header.value;
                    }
                    this.response.writeHead(this.status, headers);
                    this.response.end(this.buffer);
                    this.flushed = true;
                }
                parseContentType() {
                    if (typeof this.contentType == 'string') {
                        return String(this.contentType);
                    }
                    switch (this.contentType) {
                        case ContentType_1.default.HTML:
                            return 'text/html';
                        case ContentType_1.default.JSON:
                            return 'application/json';
                        case ContentType_1.default.TEXT:
                            return 'text/plain';
                        default:
                            return 'text/plain';
                    }
                }
                setExtra(key, value) {
                    this.extra.set(key, value);
                }
                getExtra(key) {
                    return this.extra.get(key);
                }
            }
            exports_9("default", Response);
        }
    }
});
System.register("util/ReflectType", [], function(exports_10) {
    "use strict";
    var ReflectType;
    return {
        setters:[],
        execute: function() {
            class ReflectType {
            }
            ReflectType.TYPE = 'design:type';
            ReflectType.PARAMETER_TYPE = 'design:paramtypes';
            ReflectType.RETURN_TYPE = 'design:returntype';
            exports_10("default", ReflectType);
        }
    }
});
System.register("processor/PreProcessor", [], function(exports_11) {
    "use strict";
    var PreProcessor;
    return {
        setters:[],
        execute: function() {
            class PreProcessor {
                constructor() {
                }
            }
            exports_11("default",PreProcessor);
        }
    }
});
System.register("processor/PostProcessor", [], function(exports_12) {
    "use strict";
    var PostProcessor;
    return {
        setters:[],
        execute: function() {
            class PostProcessor {
                constructor() {
                }
            }
            exports_12("default",PostProcessor);
        }
    }
});
/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
/// <reference path="../../../shared.ts/typings/node/node.d.ts"/>
System.register("entity/RouteHandler", ['reflect-metadata', "util/HttpMethod", "exception/NotFoundException", "exception/Exception", "entity/Request", "entity/Response", "entity/Url"], function(exports_13) {
    "use strict";
    var HttpMethod_2, NotFoundException_1, Exception_2, Request_1, Response_1, Url_1;
    var defaultSubHandlerTypes, RouteHandler;
    return {
        setters:[
            function (_1) {},
            function (HttpMethod_2_1) {
                HttpMethod_2 = HttpMethod_2_1;
            },
            function (NotFoundException_1_1) {
                NotFoundException_1 = NotFoundException_1_1;
            },
            function (Exception_2_1) {
                Exception_2 = Exception_2_1;
            },
            function (Request_1_1) {
                Request_1 = Request_1_1;
            },
            function (Response_1_1) {
                Response_1 = Response_1_1;
            },
            function (Url_1_1) {
                Url_1 = Url_1_1;
            }],
        execute: function() {
            defaultSubHandlerTypes = [{
                    type: Request_1.default,
                    key: null,
                    source: null
                }, {
                    type: Response_1.default,
                    key: null,
                    source: null
                }];
            class RouteHandler {
                constructor() {
                    this.preProcessors = new Array();
                    this.postProcessors = new Array();
                }
                getMethod() {
                    return HttpMethod_2.default.GET;
                }
                getPath() {
                    return '';
                }
                add(processor) {
                    this.preProcessors.push(processor);
                }
                addLast(processor) {
                    this.postProcessors.push(processor);
                }
                handle(req, response, buffer) {
                    return __awaiter(this, void 0, Promise, function* () {
                        let u = req.url;
                        let self = this;
                        let found = false;
                        try {
                            for (let key in this.subHandlers) {
                                let subRoute = this.subHandlers[key];
                                if (Url_1.default.match(u, this.getPath() + subRoute.path)) {
                                    let request = new Request_1.default(req, Url_1.default.parse(u, this.getPath() + subRoute.path), buffer);
                                    for (let processor of (this.preProcessors || [])) {
                                        yield processor.handle(request);
                                    }
                                    for (let processor of ((this.subPreProcessors || {})[key] || [])) {
                                        yield processor.handle(request);
                                    }
                                    let types = (this.subHandlerParams || {})[key] || defaultSubHandlerTypes;
                                    let params = [];
                                    for (let type of types) {
                                        if (type.source == 'path') {
                                            params.push(request.getUrl().getParam(type.key));
                                        }
                                        else if (type.source == 'query') {
                                            params.push(request.getUrl().getQuery(type.key));
                                        }
                                        else {
                                            if (type.type == Request_1.default) {
                                                params.push(request);
                                            }
                                            else if (type.type == Response_1.default) {
                                                params.push(response);
                                            }
                                            else {
                                                params.push(null);
                                            }
                                        }
                                    }
                                    yield this[key](...params);
                                    for (let processor of ((this.subPostProcessors || {})[key] || [])) {
                                        yield processor.handle(response);
                                    }
                                    for (let processor of (this.postProcessors || [])) {
                                        yield processor.handle(response);
                                    }
                                    found = true;
                                    break;
                                }
                            }
                        }
                        catch (e) {
                            if (e instanceof Exception_2.default) {
                                throw e;
                            }
                            throw new Exception_2.default('Internal Error', e);
                        }
                        if (!found) {
                            throw new NotFoundException_1.default();
                        }
                    });
                }
            }
            exports_13("default",RouteHandler);
        }
    }
});
System.register("util/ResponseBuilder", [], function(exports_14) {
    "use strict";
    var ResponseBuilder;
    return {
        setters:[],
        execute: function() {
            class ResponseBuilder {
                static status(status) {
                    let a = new ResponseBuilder();
                    return a;
                }
                header(key, value) {
                }
                /**
                 * @internal
                 */
                build(response) {
                }
            }
            exports_14("default", ResponseBuilder);
        }
    }
});
/// <reference path="../../shared.ts/typings/node/node.d.ts"/>
System.register("App", ["entity/Request", "entity/Url", "entity/Response", "util/HttpStatus", "exception/NotFoundException", 'http'], function(exports_15) {
    "use strict";
    var Request_2, Url_2, Response_2, HttpStatus_2, NotFoundException_2, http;
    var App;
    return {
        setters:[
            function (Request_2_1) {
                Request_2 = Request_2_1;
            },
            function (Url_2_1) {
                Url_2 = Url_2_1;
            },
            function (Response_2_1) {
                Response_2 = Response_2_1;
            },
            function (HttpStatus_2_1) {
                HttpStatus_2 = HttpStatus_2_1;
            },
            function (NotFoundException_2_1) {
                NotFoundException_2 = NotFoundException_2_1;
            },
            function (http_1) {
                http = http_1;
            }],
        execute: function() {
            class App {
                /**
                 * Entry point
                 */
                constructor() {
                    this.routes = new Array();
                    this.server = http.createServer(this.serverHandler.bind(this));
                    this.exceptionHandler = this.defaultExceptionHandler;
                }
                /**
                 * Handler for server, pre- and post- process for each request
                 * @param req raw request object from http.Server
                 * @param res raw response object from http.Server
                 */
                serverHandler(req, res) {
                    let buffer = '';
                    let self = this;
                    let u = req.url;
                    req.on('data', chunk => buffer += chunk);
                    req.on('end', () => {
                        let response = new Response_2.default(res);
                        let found = false;
                        for (let route of self.routes) {
                            if (Url_2.default.match(u, route.getPath() + '/*')) {
                                let url = Url_2.default.parse(u, route.getPath());
                                let request = new Request_2.default(req, url, buffer);
                                let response = new Response_2.default(res);
                                route.handle(req, response, buffer)
                                    .then(() => {
                                    response.flush();
                                })
                                    .catch((e) => {
                                    self.exceptionHandler(e, response);
                                });
                                found = true;
                            }
                            else if (Url_2.default.match(u, route.getPath())) {
                                let url = Url_2.default.parse(u, route.getPath());
                                let request = new Request_2.default(req, url, buffer);
                                let response = new Response_2.default(res);
                                route.handle(req, response, buffer)
                                    .then(() => {
                                    response.flush();
                                })
                                    .catch((e) => {
                                    self.exceptionHandler(e, response);
                                });
                                found = true;
                            }
                        }
                        if (!found) {
                            self.exceptionHandler(new NotFoundException_2.default(), response);
                        }
                    });
                }
                /**
                 * start the server
                 * @param port a port to listen to
                 * @param hostname optional
                 */
                listen(port, hostname) {
                    this.server.listen(port, hostname);
                }
                /**
                 * @param route a register a HouteHandler instance
                 */
                register(route) {
                    this.routes.push(route);
                }
                /**
                 * @param fn a callback function when an exception is thrown
                 */
                setExceptionHandler(fn) {
                    this.exceptionHandler = fn;
                }
                /**
                 * default exception handler
                 */
                defaultExceptionHandler(exception, response) {
                    console.error(exception.getStack());
                    console.error(exception.getMessage());
                    console.log(exception.getMessage());
                    if (exception instanceof NotFoundException_2.default) {
                        response.setStatus(HttpStatus_2.default.NOT_FOUND);
                    }
                    response.flush();
                }
            }
            exports_15("default", App);
        }
    }
});
//export default App;
System.register("exception/FilterException", ["exception/Exception"], function(exports_16) {
    "use strict";
    var Exception_3;
    var FilterException;
    return {
        setters:[
            function (Exception_3_1) {
                Exception_3 = Exception_3_1;
            }],
        execute: function() {
            class FilterException extends Exception_3.default {
                constructor(e) {
                    super('The requested paramters is not processable');
                    this.setExtra('detail', e);
                }
            }
            exports_16("default", FilterException);
        }
    }
});
System.register("processor/JsonReader", ["processor/PreProcessor", "util/ContentType"], function(exports_17) {
    "use strict";
    var PreProcessor_1, ContentType_2;
    var JsonReader;
    return {
        setters:[
            function (PreProcessor_1_1) {
                PreProcessor_1 = PreProcessor_1_1;
            },
            function (ContentType_2_1) {
                ContentType_2 = ContentType_2_1;
            }],
        execute: function() {
            class JsonReader extends PreProcessor_1.default {
                handle(request) {
                    let str = request.getBody();
                    if (ContentType_2.default.match(request.getHeader('Content-Type'), ContentType_2.default.JSON)) {
                        try {
                            let body = JSON.parse(str);
                            request.setExtra('body', body);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
            exports_17("default", JsonReader);
        }
    }
});
System.register("processor/JsonWriter", ["processor/PostProcessor", "util/ContentType"], function(exports_18) {
    "use strict";
    var PostProcessor_1, ContentType_3;
    var JsonWriter;
    return {
        setters:[
            function (PostProcessor_1_1) {
                PostProcessor_1 = PostProcessor_1_1;
            },
            function (ContentType_3_1) {
                ContentType_3 = ContentType_3_1;
            }],
        execute: function() {
            class JsonWriter extends PostProcessor_1.default {
                handle(response) {
                    let body = response.getExtra('body');
                    if (body) {
                        try {
                            response.write(JSON.stringify(body));
                            response.setContentType(ContentType_3.default.JSON);
                        }
                        catch (e) {
                        }
                    }
                }
            }
            exports_18("default", JsonWriter);
        }
    }
});
System.register("util/Route", ["util/HttpMethod", "util/ReflectType", 'reflect-metadata'], function(exports_19) {
    "use strict";
    var HttpMethod_3, ReflectType_1;
    var Route;
    return {
        setters:[
            function (HttpMethod_3_1) {
                HttpMethod_3 = HttpMethod_3_1;
            },
            function (ReflectType_1_1) {
                ReflectType_1 = ReflectType_1_1;
            },
            function (_2) {}],
        execute: function() {
            (function (Route) {
                function Method(method) {
                    return (target, propertyKey, descriptor) => {
                        target.subHandlers = target.subHandlers || {};
                        let path = '';
                        if (target.subHandlers[propertyKey]) {
                            path = target.subHandlers[propertyKey].path;
                        }
                        target.subHandlers[propertyKey] = target.subHandlers[propertyKey] || { method: method, path: path };
                        target.subHandlers[propertyKey].method = method;
                        return descriptor;
                    };
                }
                Route.Method = Method;
                function Path(path) {
                    return (target) => {
                        target.prototype.getPath = function () {
                            return path;
                        };
                        return target;
                    };
                }
                Route.Path = Path;
                function SubPath(path) {
                    return (target, propertyKey, descriptor) => {
                        target.subHandlers = target.subHandlers || {};
                        let method = HttpMethod_3.default.GET;
                        if (target.subHandlers[propertyKey]) {
                            method = target.subHandlers[propertyKey].method;
                        }
                        target.subHandlers[propertyKey] = target.subHandlers[propertyKey] || { method: method, path: path };
                        target.subHandlers[propertyKey].path = path;
                        return descriptor;
                    };
                }
                Route.SubPath = SubPath;
                function PreFilter(processor) {
                    return (target, propertyKey, descriptor) => {
                        target.subPreProcessors = target.subPreProcessors || {};
                        target.subPreProcessors[propertyKey] = target.subPreProcessors[propertyKey] || [];
                        target.subPreProcessors[propertyKey].push(processor);
                        return descriptor;
                    };
                }
                Route.PreFilter = PreFilter;
                function PostFilter(processor) {
                    return (target, propertyKey, descriptor) => {
                        target.subPostProcessors = target.subPostProcessors || {};
                        target.subPostProcessors[propertyKey] = target.subPostProcessors[propertyKey] || [];
                        target.subPostProcessors[propertyKey].push(processor);
                        return descriptor;
                    };
                }
                Route.PostFilter = PostFilter;
                function PathParam(param) {
                    return (target, key, index) => {
                        let types = Reflect.getMetadata(ReflectType_1.default.PARAMETER_TYPE, target, key);
                        target.subHandlerParams = target.subHandlerParams || {};
                        target.subHandlerParams[key] = target.subHandlerParams[key] || [];
                        let i = 0;
                        for (let type of types) {
                            let source = null;
                            let paramKey = null;
                            let t = target.subHandlerParams[key][i];
                            if (i == index) {
                                source = 'path';
                                paramKey = param;
                            }
                            target.subHandlerParams[key][i] = t ||
                                { type: type, key: paramKey, source: source };
                            i++;
                        }
                    };
                }
                Route.PathParam = PathParam;
                function QueryParam(param) {
                    return (target, key, index) => {
                        let types = Reflect.getMetadata(ReflectType_1.default.PARAMETER_TYPE, target, key);
                        target.subHandlerParams = target.subHandlerParams || {};
                        target.subHandlerParams[key] = target.subHandlerParams[key] || [];
                        let i = 0;
                        for (let type of types) {
                            let source = null;
                            let paramKey = null;
                            let t = target.subHandlerParams[key][i];
                            if (i == index) {
                                source = 'query';
                                paramKey = param;
                                t.source = source;
                                t.key = paramKey;
                            }
                            target.subHandlerParams[key][i] = t ||
                                { type: type, key: paramKey, source: source };
                            i++;
                        }
                    };
                }
                Route.QueryParam = QueryParam;
                function Produce(type) {
                    return (target, key) => {
                        let type = Reflect.getMetadata(ReflectType_1.default.RETURN_TYPE, target, key);
                    };
                }
                Route.Produce = Produce;
            })(Route || (Route = {}));
            exports_19("default",Route);
        }
    }
});
System.register("httpts", ["App", "entity/Request", "entity/Response", "entity/RouteHandler", "entity/Url", "exception/Exception", "exception/FilterException", "exception/NotFoundException", "processor/JsonReader", "processor/JsonWriter", "processor/PreProcessor", "processor/PostProcessor", "util/ContentType", "util/HttpMethod", "util/HttpStatus", "util/Map", "util/ReflectType", "util/ResponseBuilder", "util/Route"], function(exports_20) {
    "use strict";
    var App_1, Request_3, Response_3, RouteHandler_1, Url_3, Exception_4, FilterException_1, NotFoundException_3, JsonReader_1, JsonWriter_1, PreProcessor_2, PostProcessor_2, ContentType_4, HttpMethod_4, HttpStatus_3, Map_5, ReflectType_2, ResponseBuilder_1, Route_1;
    var entity, exception, processor, util;
    return {
        setters:[
            function (App_1_1) {
                App_1 = App_1_1;
            },
            function (Request_3_1) {
                Request_3 = Request_3_1;
            },
            function (Response_3_1) {
                Response_3 = Response_3_1;
            },
            function (RouteHandler_1_1) {
                RouteHandler_1 = RouteHandler_1_1;
            },
            function (Url_3_1) {
                Url_3 = Url_3_1;
            },
            function (Exception_4_1) {
                Exception_4 = Exception_4_1;
            },
            function (FilterException_1_1) {
                FilterException_1 = FilterException_1_1;
            },
            function (NotFoundException_3_1) {
                NotFoundException_3 = NotFoundException_3_1;
            },
            function (JsonReader_1_1) {
                JsonReader_1 = JsonReader_1_1;
            },
            function (JsonWriter_1_1) {
                JsonWriter_1 = JsonWriter_1_1;
            },
            function (PreProcessor_2_1) {
                PreProcessor_2 = PreProcessor_2_1;
            },
            function (PostProcessor_2_1) {
                PostProcessor_2 = PostProcessor_2_1;
            },
            function (ContentType_4_1) {
                ContentType_4 = ContentType_4_1;
            },
            function (HttpMethod_4_1) {
                HttpMethod_4 = HttpMethod_4_1;
            },
            function (HttpStatus_3_1) {
                HttpStatus_3 = HttpStatus_3_1;
            },
            function (Map_5_1) {
                Map_5 = Map_5_1;
            },
            function (ReflectType_2_1) {
                ReflectType_2 = ReflectType_2_1;
            },
            function (ResponseBuilder_1_1) {
                ResponseBuilder_1 = ResponseBuilder_1_1;
            },
            function (Route_1_1) {
                Route_1 = Route_1_1;
            }],
        execute: function() {
            entity = {
                Request: Request_3.default,
                Response: Response_3.default,
                RouteHandler: RouteHandler_1.default,
                Url: Url_3.default
            };
            exception = {
                Exception: Exception_4.default,
                FilterException: FilterException_1.default,
                NotFoundException: NotFoundException_3.default
            };
            processor = {
                JsonReader: JsonReader_1.default,
                JsonWriter: JsonWriter_1.default,
                PreProcessor: PreProcessor_2.default,
                PostProcessor: PostProcessor_2.default
            };
            util = {
                ContentType: ContentType_4.default,
                HttpMethod: HttpMethod_4.default,
                HttpStatus: HttpStatus_3.default,
                Map: Map_5.default,
                ReflectType: ReflectType_2.default,
                ResponseBuilder: ResponseBuilder_1.default,
                Route: Route_1.default
            };
            exports_20("App", App_1.default);
            exports_20("entity", entity);
            exports_20("exception", exception);
            exports_20("processor", processor);
            exports_20("util", util);
        }
    }
});
