import HttpMethod from './HttpMethod';
import ContentType from './ContentType';
import RouteHandler from '../entity/RouteHandler';
import PreProcessor from '../processor/PreProcessor';
import PostProcessor from '../processor/PostProcessor';
import ReflectType from './ReflectType';


/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
import 'reflect-metadata';


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

export function PathParam(param:string) {
	return (target:RouteHandler, key:string, index:number) => {
		let types = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key);
		target.subHandlerParams = target.subHandlerParams || {};
		target.subHandlerParams[key] = target.subHandlerParams[key] || [];
		let i = 0;
		for (let type of types) {
			let source = null;
			let paramKey = null;
			let t = target.subHandlerParams[key][i]
			if (i == index) {
				source = 'path';
				paramKey = param;
			}
			target.subHandlerParams[key][i] = t || 
											{type, key: paramKey, source};
			i++;
		}
	}
}

export function QueryParam(param:string) {
	return (target:RouteHandler, key:string, index:number) => {
		let types = Reflect.getMetadata(ReflectType.PARAMETER_TYPE, target, key);
		target.subHandlerParams = target.subHandlerParams || {};
		target.subHandlerParams[key] = target.subHandlerParams[key] || [];
		let i = 0;
		for (let type of types) {
			let source = null;
			let paramKey = null;
			let t = target.subHandlerParams[key][i]
			if (i == index) {
				source = 'query';
				paramKey = param;
				t.source = source;
				t.key = paramKey;
			}
			target.subHandlerParams[key][i] = t || 
											{type, key: paramKey, source};
			i++;
		}
	}
}

export function Produce(type:ContentType) {
	return (target:RouteHandler, key:string) => {
		let type = Reflect.getMetadata(ReflectType.RETURN_TYPE, target, key);
	}
}