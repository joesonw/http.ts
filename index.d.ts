/// <reference path="../shared.ts/typings/node/node.d.ts" />
/// <reference path="node_modules/reflect-metadata/reflect-metadata.d.ts" />
declare module "util/Map" {
    class Map<T> {
        private data;
        constructor(source?: Map<T>);
        set(key: string, value: T): void;
        get(key: string): T;
        remove(key: string): T;
        has(key: string): boolean;
        entrySet(): Array<Map.Entry<T>>;
        iterator(): Map.Iterator<T>;
    }
    namespace Map {
        interface Entry<T> {
            key: string;
            value: T;
        }
        interface Iterator<T> {
            key: string;
            value: T;
            next: Iterator<T>;
        }
    }
    export default Map;
}
declare module "util/HttpMethod" {
    enum HttpMethod {
        GET = 0,
        POST = 1,
        PUT = 2,
        DELETE = 3,
        PATCH = 4,
    }
    export default HttpMethod;
}
declare module "entity/Url" {
    import Map from "util/Map";
    export default class Url {
        private path;
        private params;
        private query;
        constructor(path: string, params: Map<any>, query: Map<any>);
        getParams(): Map<any>;
        getParam(key: string): any;
        getQueries(): Map<any>;
        getQuery(key: string): any;
        static match(url: string, pattern: string): boolean;
        static parse(url: string, pattern: string): Url;
    }
}
declare module "entity/Request" {
    import * as http from 'http';
    import Map from "util/Map";
    import HttpMethod from "util/HttpMethod";
    import Url from "entity/Url";
    class Request {
        private request;
        private extra;
        private headers;
        private httpVersion;
        private httpMethod;
        private url;
        private path;
        private query;
        private body;
        private params;
        constructor(request: http.IncomingMessage, url: Url, body: string);
        /**
         * Get all HTTP headers
         */
        getHeaders(): Map<string>;
        /**
         * Get HTTP header by key
         * @param header name to get
         */
        getHeader(key: string): string;
        /**
     // 	 * Get http version
         */
        getVersion(): string;
        getMethod(): HttpMethod;
        getUrl(): Url;
        getBody(): string;
        setExtra(key: string, value: any): void;
        getExtra(key: string): any;
    }
    export default Request;
}
declare module "exception/Exception" {
    import Map from "util/Map";
    class Exception {
        protected stack: string;
        protected message: string;
        protected extra: Map<any>;
        constructor(message: string, e?: Error);
        getStack(): string;
        getMessage(): string;
        setExtra(key: string, value: any): void;
        getExtra(key: string): any;
    }
    export default Exception;
}
declare module "exception/NotFoundException" {
    import Exception from "exception/Exception";
    export default class NotFoundException extends Exception {
        constructor();
    }
}
declare module "util/ContentType" {
    enum ContentType {
        JSON = 0,
        TEXT = 1,
        HTML = 2,
    }
    namespace ContentType {
        function match(header: string, type: ContentType): boolean;
    }
    export default ContentType;
}
declare module "util/HttpStatus" {
    enum HttpStatus {
        OK = 200,
        CREATED = 201,
        NOT_FOUND = 404,
        NOT_PROCESSABLE = 422,
    }
    export default HttpStatus;
}
declare module "entity/Response" {
    import * as http from 'http';
    import ContentType from "util/ContentType";
    import HttpStatus from "util/HttpStatus";
    import Map from "util/Map";
    export default class Response {
        private buffer;
        private status;
        private headers;
        private contentType;
        private flushed;
        private extra;
        private response;
        constructor(response: http.ServerResponse);
        write(data: string): void;
        append(data: string): void;
        setStatus(status: HttpStatus): void;
        getStatus(): HttpStatus;
        setContentType(type: ContentType | string): void;
        getContentType(): ContentType | string;
        getHeaders(): Map<string>;
        getHeader(key: string): string;
        setHeaders(headers: Map<string>): void;
        setHeader(key: string, value: string): void;
        flush(): void;
        private parseContentType();
        setExtra(key: string, value: any): void;
        getExtra(key: string): any;
    }
}
declare module "util/ReflectType" {
    export default class ReflectType {
        static TYPE: string;
        static PARAMETER_TYPE: string;
        static RETURN_TYPE: string;
    }
}
declare module "processor/PreProcessor" {
    import Request from "entity/Request";
    abstract class PreProcessor {
        constructor();
        abstract handle(request: Request): any;
    }
    export default PreProcessor;
}
declare module "processor/PostProcessor" {
    import Response from "entity/Response";
    abstract class PostProcessor {
        constructor();
        abstract handle(response: Response): any;
    }
    export default PostProcessor;
}
declare module "entity/RouteHandler" {
    import * as http from 'http';
    import HttpMethod from "util/HttpMethod";
    import Response from "entity/Response";
    import PreProcessor from "processor/PreProcessor";
    import PostProcessor from "processor/PostProcessor";
    abstract class RouteHandler {
        subHandlers: {
            [fnName: string]: {
                method: HttpMethod;
                path: string;
            };
        };
        subPreProcessors: {
            [fnName: string]: Array<PreProcessor>;
        };
        subPostProcessors: {
            [fnName: string]: Array<PostProcessor>;
        };
        subHandlerParams: {
            [fnName: string]: Array<{
                type: Function;
                key: string;
                source: string;
            }>;
        };
        private preProcessors;
        private postProcessors;
        getMethod(): HttpMethod;
        getPath(): string;
        add(processor: PreProcessor): void;
        addLast(processor: PostProcessor): void;
        handle(req: http.IncomingMessage, response: Response, buffer: string): Promise<void>;
    }
    export default RouteHandler;
}
declare module "util/ResponseBuilder" {
    import HttpStatus from "util/HttpStatus";
    import Response from "entity/Response";
    export default class ResponseBuilder {
        private _status;
        static status(status: HttpStatus): ResponseBuilder;
        header(key: string, value: string): void;
        /**
         * @internal
         */
        build(response: Response): void;
    }
}
declare module "App" {
    import RouteHandler from "entity/RouteHandler";
    import Response from "entity/Response";
    import Exception from "exception/Exception";
    export default class App {
        private server;
        private routes;
        private exceptionHandler;
        /**
         * Entry point
         */
        constructor();
        /**
         * Handler for server, pre- and post- process for each request
         * @param req raw request object from http.Server
         * @param res raw response object from http.Server
         */
        private serverHandler(req, res);
        /**
         * start the server
         * @param port a port to listen to
         * @param hostname optional
         */
        listen(port: number, hostname?: string): void;
        /**
         * @param route a register a HouteHandler instance
         */
        register(route: RouteHandler): void;
        /**
         * @param fn a callback function when an exception is thrown
         */
        setExceptionHandler(fn: (exception: Exception, response: Response) => void): void;
        /**
         * default exception handler
         */
        private defaultExceptionHandler(exception, response);
    }
}
declare module "exception/FilterException" {
    import Exception from "exception/Exception";
    export default class FilterException extends Exception {
        constructor(e: any);
    }
}
declare module "processor/JsonReader" {
    import PreProcessor from "processor/PreProcessor";
    import Request from "entity/Request";
    export default class JsonReader extends PreProcessor {
        handle(request: Request): void;
    }
}
declare module "processor/JsonWriter" {
    import Response from "entity/Response";
    import PostProcessor from "processor/PostProcessor";
    export default class JsonWriter extends PostProcessor {
        handle(response: Response): void;
    }
}
declare module "util/Route" {
    import HttpMethod from "util/HttpMethod";
    import ContentType from "util/ContentType";
    import RouteHandler from "entity/RouteHandler";
    import PreProcessor from "processor/PreProcessor";
    import PostProcessor from "processor/PostProcessor";
    namespace Route {
        function Method(method: HttpMethod): (target: RouteHandler, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
        function Path(path: string): (target: any) => any;
        function SubPath(path: string): (target: RouteHandler, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
        function PreFilter(processor: PreProcessor): (target: RouteHandler, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
        function PostFilter(processor: PostProcessor): (target: RouteHandler, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
        function PathParam(param: string): (target: RouteHandler, key: string, index: number) => void;
        function QueryParam(param: string): (target: RouteHandler, key: string, index: number) => void;
        function Produce(type: ContentType): (target: RouteHandler, key: string) => void;
    }
    export default Route;
}
declare module "httpts" {
    import App from "App";
    import Request from "entity/Request";
    import Response from "entity/Response";
    import RouteHandler from "entity/RouteHandler";
    import Url from "entity/Url";
    const entity: {
        Request: typeof Request;
        Response: typeof Response;
        RouteHandler: typeof RouteHandler;
        Url: typeof Url;
    };
    import Exception from "exception/Exception";
    import FilterException from "exception/FilterException";
    import NotFoundException from "exception/NotFoundException";
    const exception: {
        Exception: typeof Exception;
        FilterException: typeof FilterException;
        NotFoundException: typeof NotFoundException;
    };
    import JsonReader from "processor/JsonReader";
    import JsonWriter from "processor/JsonWriter";
    import PreProcessor from "processor/PreProcessor";
    import PostProcessor from "processor/PostProcessor";
    const processor: {
        JsonReader: typeof JsonReader;
        JsonWriter: typeof JsonWriter;
        PreProcessor: typeof PreProcessor;
        PostProcessor: typeof PostProcessor;
    };
    import ContentType from "util/ContentType";
    import HttpMethod from "util/HttpMethod";
    import HttpStatus from "util/HttpStatus";
    import Map from "util/Map";
    import ReflectType from "util/ReflectType";
    import ResponseBuilder from "util/ResponseBuilder";
    import Route from "util/Route";
    const util: {
        ContentType: typeof ContentType;
        HttpMethod: typeof HttpMethod;
        HttpStatus: typeof HttpStatus;
        Map: typeof Map;
        ReflectType: typeof ReflectType;
        ResponseBuilder: typeof ResponseBuilder;
        Route: typeof Route;
    };
    export { App, entity, exception, processor, util };
}
