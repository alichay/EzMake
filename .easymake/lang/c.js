var walk = require("walk");
var shell = require('child_process').execSync;
var fs = require("fs");
var read =	function(path){return fs.readFileSync(path).toString();};
var cpp = [];
var h = [];
module.exports = function(flags, outName) {
	
	try {
		shell("mkdir -p .ezmake_files/src >/dev/null 2>&1");
	} catch(e){}
	try {
		shell("mkdir bin/ >/dev/null 2>&1");
	} catch(e){}
	args = process.argv.slice(2);
	
	// COMMAND LINE SETTINGS
	cleanBuild = false;

	for(var i=0;i<args.length;i++) {
		arg = args[i];
		if(arg=="fresh") {
			cleanBuild = true;
			try {
				shell("rm -r .ezmake_files/output/* >/dev/null 2>&1");
			} catch(e){}
		} else if(arg=="getFileName") {
			process.stdout.write("./bin/"+outName);
			return; // Run command shouldn't build.
		}
	}
	
	console.log("EzMake C/C++ v1 - Zac Pierson");
	console.log("Outputting executable file \"bin/"+outName+"\"");

	var walker = walk.walk("./src", {followLinks: false});

	walker.on('file', function(root, stat, next) {
		if(stat.name.endsWith(["c", "i", "ii", "m", "mi", "cc", "cp", "cxx", "cpp", "CPP", "c++", "C"])) {
			cpp.push({name:(root.replace("./", "") + '/' + stat.name),recomp:cleanBuild});
		} else if(stat.name.endsWith([".h", ".hpp", ".H", ".hh"])) {
			h.push({name:(root.replace("./", "") + '/' + stat.name),ref:[]});
		}
		next();
	});

	walker.on('end', function(){
		var i=0,j=0,checkWith="";
		if(!cleanBuild) {
			for(i=0;i<cpp.length;i++) {
				checkWith = ".ezmake_files/"+cpp[i].name;
				shell("mkdir -p \""+checkWith.substr(0,checkWith.lastIndexOf("/"))+"\" >/dev/null 2>&1");
				shell("touch \""+checkWith+"\" >/dev/null 2>&1");
				contentsSource = read(cpp[i].name);
				contentsCompare= read(checkWith);
				if(contentsSource != contentsCompare) {
					cpp[i].recomp = true;
				}
				if(!cpp[i].recomp) {
					for(j=0;j<h.length;j++) {
						//console.log(h[j].name.substr(h[j].name.lastIndexOf("/")+1));
						if(contentsSource.indexOf( h[j].name.substr(h[j].name.lastIndexOf("/")+1) ) > -1) {
							//console.log(cpp[i].name+" uses "+h[j].name);
							h[j].ref.push(i);
						}
					}
				}
			}
			
			for(i=0;i<h.length;i++) {
				checkWith = ".ezmake_files/"+h[i].name;
				shell("mkdir -p \""+checkWith.substr(0,checkWith.lastIndexOf("/"))+"\"");
				shell("touch \""+checkWith+"\"");
				contentsSource = read(h[i].name);
				contentsCompare= read(checkWith);
				if(contentsSource != contentsCompare) {
					ref = h[i].ref;
					for(j=0;j<ref.length;j++) {
						//console.log("recomp in h");
						cpp[ref[j]].recomp=true;
					}
				}
			}
		}
		shell("find .ezmake_files/src/ -maxdepth 100 -type f -delete");
		//shell("rm -r .ezmake_files/output/*");
		shell("cp -r src/* .ezmake_files/src/");

		objects = "";

		for(i=0;i<cpp.length;i++) {
			object = ".ezmake_files/output/"+cpp[i].name.rplifend(["c", "i", "ii", "m", "mi", "cc", "cp", "cxx", "cpp", "CPP", "c++", "C"], "o").replace("src/", "");
			objects = objects + " \"" + object + "\"";
			//console.log(cpp[i]);
			if(cpp[i].recomp) {
				shell("mkdir -p \""+object.substr(0,object.lastIndexOf("/"))+"\"");
				compiler = "g++ -std=c++11";
				if(cpp[i].name.endsWith(["c", "i"])) compiler = "gcc";

				console.log("compiling "+cpp[i].name+" with '"+compiler+" "+flags+"'");

				shell(compiler + " " + flags + " -c -o \""+object+"\" \""+cpp[i].name+"\"");
			}
		}

		shell("g++ " + flags + " -o \"bin/"+outName+"\" "+objects);
	});
};
