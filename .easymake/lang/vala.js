var walk = require("walk");
var shell = require('child_process').execSync;
var fs = require("fs");
var sources = [];
module.exports = function(flags, outName, entryPoint) {
	
	args = process.argv.slice(2);
	for(var i=0;i<args.length;i++) {
		arg = args[i];
		if(arg=="getFileName") {
			process.stdout.write("./bin/"+outName);
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
	try {
		shell("cp -R src/* .ezmake_files/output/");
	} catch(e){}

	console.log("EzMake Vala v1 - Zac Pierson");
	console.log("Outputting executable file \"bin/"+outName+"\"");

	var walker = walk.walk("./.ezmake_files/output", {followLinks: false});

	walker.on('file', function(root, stat, next) {
		if(stat.name.toLowerCase().endsWith(["vala", "c"])) {
			sources.push(root.replace("./", "") + '/' + stat.name);
		}
		next();
	});

	walker.on('end', function(){
		
		console.log("Compiling with '"+("valac "+flags).trim()+"'.");
		shell("valac " + flags + " \""+sources.join('" "')+"\" -o \"./bin/"+outName+"\"");
	});
};
