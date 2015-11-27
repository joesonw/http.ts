import HttpMethod from './HttpMethod';
import Decorator from './util/Decorator';
import RouteHandler from './RouteHandler';

export function Method(method:HttpMethod) {
	return (target:RouteHandler, propertyKey:string, descriptor: TypedPropertyDescriptor<any>) => {

		target.subHandlers = target.subHandlers || {};
		let path = '';
		if (target.subHandlers[propertyKey]) {
			path = target.subHandlers[propertyKey].path;
		}
		
		target.subHandlers[propertyKey] = target.subHandlers[propertyKey] || {method, path};
		target.subHandlers[propertyKey].method = method;
		return descriptor;
	}
}

export function Path(path:string) {
	return (target:any) => {
		target.prototype.getPath = function() {
			return path;
		}
		return target;
	}
}

export function SubPath(path:string) {
	return (target:RouteHandler, propertyKey:string, descriptor: TypedPropertyDescriptor<any>) => {
		target.subHandlers = target.subHandlers || {};
		let method = HttpMethod.GET;
		if (target.subHandlers[propertyKey]) {
			method = target.subHandlers[propertyKey].method;
		}
		target.subHandlers[propertyKey] = target.subHandlers[propertyKey] || {method, path};
		target.subHandlers[propertyKey].path = path;
		return descriptor;
	}
}