export enum ContentType {
	JSON,
	TEXT,
	HTML
}

const JSON_string = ['application/json'];

export function match(header:string, type:ContentType):boolean {
	switch (type) {
		case ContentType.JSON:
			if (JSON_string.indexOf(header) !== -1) return true;
	}
	return false;
}
