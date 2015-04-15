var walk = require("walk");
var shell = require('child_process').execSync;
var fs = require("fs");
var sources = [];
module.exports = function(flags, outName, entryPoint) {
	
	args = process.argv.slice(2);
	for(var i=0;i<args.length;i++) {
		arg = args[i];
		if(arg=="getFileName") {
			process.stdout.write("java -jar ./bin/"+outName);
			return; // Run command shouldn't build.
		}
	}

	try {
		shell("rm -r .ezmake_files >/dev/null 2>&1");
	} catch(e){}
	try {
		shell("mkdir -p .ezmake_files/output >/dev/null 2>&1");
	} catch(e){}
	try {
		shell("mkdir bin/ >/dev/null 2>&1");
	} catch(e){}

	console.log("EzMake Java v1 - Zac Pierson");
	console.log("Outputting JAR file \"bin/"+outName+"\"");

	var walker = walk.walk("./src", {followLinks: false});

	walker.on('file', function(root, stat, next) {
		if(stat.name.toLowerCase().endsWith("java")) {
			sources.push(root.replace("./", "") + '/' + stat.name);
		}
		next();
	});

	walker.on('end', function(){
		//object = ".ezmake_files/output/"+sources[i].name.rplifend(["c", "i", "ii", "m", "mi", "cc", "cp", "cxx", "cpp", "CPP", "c++", "C"], "o").replace("src/", "");
		
		console.log("Compiling with '"+("javac "+flags).trim()+"'.");
		shell("javac " + flags + " \""+sources.join('" "')+"\" -d .ezmake_files/output/");
		console.log("Jarring compiled classes.");
		shell("sh -c 'cd .ezmake_files/output/ && jar cfe \"../../bin/"+outName+"\" "+entryPoint+" *'");
	});
};
