
import Map from './util/Map';

const PATH_REGEXP = new RegExp([
	'(\\\\.)',
	'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
].join('|'),'g');



class Url {
	private path: string;
	private params: Map<any>;
	private query: Map<any>;
	constructor(path:string, params:Map<any>, query:Map<any>) {
		this.path = path || '';
		this.params = params || new Map<any>();
		this.query = query || new Map<any>();
	}
	
	getParams():Map<any> {
		return new Map(this.params);
	}
	
	getParam(key:string):any {
		return this.params.get(key);
	}
	
	getQueries():Map<any> {
		return new Map(this.query);
	}
	
	getQuery(key:string):any {
		return this.query.get(key);
	}
	
	public static match(url:string, pattern:string):boolean {
		
		let tokens = parse(pattern);
		let re = tokensToRegExp(tokens,{});
		let keys = [];
		for (let i = 0; i < tokens.length; i++) {
			if (typeof tokens[i] !== 'string') {
				keys.push(tokens[i]);
			}
		}
		let params:Map<any> = new Map<any>();
		let result = re.exec(url);
		return !!result;
	}
	
	public static parse(url:string, pattern:string):Url {
		let path = url.split('?')[0];
		let queryString = url.split('?')[1];
		
		let tokens = parse(pattern);
		let re = tokensToRegExp(tokens,{});
		let keys = [];
		for (let i = 0; i < tokens.length; i++) {
			if (typeof tokens[i] !== 'string') {
				keys.push(tokens[i]);
			}
		}
		let params:Map<any> = new Map<any>();
		let result = re.exec(url);
		for (let i = 0; i < keys.length; i++) {
			params.set(keys[i].name,result[i]);
		}
		let query:Map<any> = new Map<any>();
		if (queryString) {
			let queryArr = queryString.split('&');
			for (let q of queryArr) {
				let t = q.split('=');
				query.set(t[0],t[1]);
			}
		}
		return new Url(path,params,query);
	}
}

export default Url;

function parse (str) {
	var tokens = []
	var key = 0
	var index = 0
	var path = ''
	var res

	while ((res = PATH_REGEXP.exec(str)) != null) {
		var m = res[0]
		var escaped = res[1]
		var offset = res.index
		path += str.slice(index, offset)
		index = offset + m.length

		// Ignore already escaped sequences.
		if (escaped) {
			path += escaped[1]
			continue
		}

		// Push the current path onto the tokens.
		if (path) {
			tokens.push(path)
			path = ''
		}

		var prefix = res[2]
		var name = res[3]
		var capture = res[4]
		var group = res[5]
		var suffix = res[6]
		var asterisk = res[7]

		var repeat = suffix === '+' || suffix === '*'
		var optional = suffix === '?' || suffix === '*'
		var delimiter = prefix || '/'
		var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

		tokens.push({
			name: name || key++,
			prefix: prefix || '',
			delimiter: delimiter,
			optional: optional,
			repeat: repeat,
			pattern: pattern.replace(/([=!:$\/()])/g, '\\$1')
		})
	}

	// Match any characters still remaining.
	if (index < str.length) {
		path += str.substr(index)
	}

	// If the path exists, push it onto the end.
	if (path) {
		tokens.push(path)
	}

	return tokens
}

function tokensToRegExp (tokens, options):RegExp {
	options = options || {}

	var strict = options.strict
	var end = options.end !== false
	var route = ''
	var lastToken = tokens[tokens.length - 1]
	var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

	// Iterate over the tokens and create our regexp string.
	for (var i = 0; i < tokens.length; i++) {
		var token = tokens[i]

		if (typeof token === 'string') {
			route += token.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1');
		} else {
			var prefix = token.prefix.replace((/([.+*?=^!:${}()[\]|\/])/g, '\\$1'));
			var capture = token.pattern

			if (token.repeat) {
				capture += '(?:' + prefix + capture + ')*'
			}

			if (token.optional) {
				if (prefix) {
					capture = '(?:' + prefix + '(' + capture + '))?'
				} else {
					capture = '(' + capture + ')?'
				}
			} else {
				capture = prefix + '(' + capture + ')'
			}

			route += capture
		}
	}
	// In non-strict mode we allow a slash at the end of match. If the path to
	// match already ends with a slash, we remove it for consistency. The slash
	// is valid at the end of a path match, not in the middle. This is important
	// in non-ending mode, where "/test/" shouldn't match "/test//route".
	if (!strict) {
		route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
	}

	if (end) {
		route += '$'
	} else {
		// In non-ending mode, we need the capturing groups to match as much as
		// possible by using a positive lookahead to the end or next path segment.
		route += strict && endsWithSlash ? '' : '(?=\\/|$)'
	}

	return new RegExp('^' + route, options.sensitive ? '' : 'i');
}