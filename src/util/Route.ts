import HttpMethod from './HttpMethod';
import RouteHandler from '../entity/RouteHandler';
import PreProcessor from '../processor/PreProcessor';
import PostProcessor from '../processor/PostProcessor';

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

export function PreFilter(processor:PreProcessor) {
	return (target:RouteHandler, propertyKey:string, descriptor: TypedPropertyDescriptor<any>) => {
		target.subPreProcessors = target.subPreProcessors || {};
		target.subPreProcessors[propertyKey] = target.subPreProcessors[propertyKey] || [];
		target.subPreProcessors[propertyKey].push(processor);		
		return descriptor;
	}
}

export function PostFilter(processor:PostProcessor) {
	return (target:RouteHandler, propertyKey:string, descriptor: TypedPropertyDescriptor<any>) => {
		target.subPostProcessors = target.subPostProcessors || {};
		target.subPostProcessors[propertyKey] = target.subPostProcessors[propertyKey] || [];
		target.subPostProcessors[propertyKey].push(processor);		
		return descriptor;
	}
}