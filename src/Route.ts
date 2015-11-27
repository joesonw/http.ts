import HttpMethod from './HttpMethod';

export function Method(method:HttpMethod) {
	return (target:any) => {
		target.prototype.getMethod = function() {
			return method;
		}
		return target;
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