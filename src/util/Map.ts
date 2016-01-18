
class Map<T> {
	private data:{[k:string] : T};
	constructor(source?:Map<T>) {
		this.data = {};
		if (source) {
			for (let entry of source.entrySet()) {
				this.data[entry.key] = entry.value;
			}
		}
	}
	set(key:string, value:T) {
		this.data[key] = value;
	}
	get(key:string):T {
		return this.data[key] || null;
	}
	remove(key:string):T {
		let ret = this.data[key];
		delete this.data[key];
		return ret || null;
	}
	has(key:string) {
		return (key in this.data);
	}
	entrySet():Array<Map.Entry<T>> {
		let ret = [];
		for (let key in this.data) {
			ret.push({key: key, value: this.data[key]});
		}
		return ret;
	}
	iterator():Map.Iterator<T> {
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

namespace Map {
	export interface Entry<T> {
		key:string;
		value:T;
	}
	export interface Iterator<T> {
		key:string;
		value:T;
		next: Iterator<T>;
	}
}

export default Map;
