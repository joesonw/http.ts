var gulp = require('gulp');
var glob = require('glob');
var fs = require('fs');
var path = require('path');

function buildIndex(p, name, directory, ns) {

	var files = fs.readdirSync(p);
	var modules = [];
	var directories = [];



	for (var file of files) {
		if (file[0] == '_') {
			continue;
		}
		var ext = path.extname(file);
		if (['.ts', ''].indexOf(ext) == -1) {
			continue;
		}
		if (fs.statSync(path.join(p, file)).isDirectory()) {
			buildIndex(path.join(p, file), p + '/' + file + '.ts', file, ns + '.' + file);
			directories.push(path.basename(file, ext));
		} else {
			modules.push(path.basename(file, ext));
		}
	}
	var output = `/*  ${name} */\n\n`;

	//output += `export namespace ${ns} {\n`;

	for (var index of modules) {
		output += `\texport * from '.${directory !== '' ? '/' :''}${directory}/${index}';\n`;
	}
	for (var index of directories) {
		output += `\timport * as ${index} from './${index}';\n`;
	}
	for (var index of directories) {
		output += `\texport {${index}};\n`;
	}
	//output += '}';
	output += '\n\n';

	fs.writeFileSync(name , output);
}

gulp.task('build:index', ['clean:index'], function() {
	buildIndex('./src', 'src/index.ts', '','httpts');
});


function cleanIndex(p) {
	var files = fs.readdirSync(p);
	var f = [];


	for (var file of files) {
		if (file[0] == '_') {
			continue;
		}
		var ext = path.extname(file);
		if (['.ts', ''].indexOf(ext) == -1) {
			continue;
		}
		if (fs.statSync(path.join(p, file)).isDirectory()) {
			cleanIndex(path.join(p, file));
			try {
				f.push(path.join(p, file + '.ts'));
			} catch (e) {

			}
		}
	}
	for (var i of f) {
		try {
			fs.unlinkSync(i);
		} catch(e) {
			
		}
	}
}

gulp.task('clean:index', function() {
	try {
		fs.unlinkSync('./src/index.ts');
	} catch (e) {

	}
	cleanIndex('./src');
})
