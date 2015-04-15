Object.defineProperty(String.prototype, 'startsWith', {
	enumerable: false,
	configurable: false,
	writable: false,
	value: function(searchString, position) {
		position = position |0;
		return this.lastIndexOf(searchString, position) === position;
	}
});
String.prototype.endsWith = function(searchString, position) {
	if(typeof searchString == "object") {
		for(var i=0;i<searchString.length;i++) {
			if(this.endsWith(searchString[i], position)) return true;
		}
		return false;
	}
	var subjectString = this.toString();
	if (position === undefined || position > subjectString.length) {
		position = subjectString.length;
	}
	position -= searchString.length;
	var lastIndex = subjectString.indexOf(searchString, position);
	return lastIndex !== -1 && lastIndex === position;
};
String.prototype.replaceLast = function(find, replace) {
	var index = this.lastIndexOf(find);
	if (index >= 0) {
		return this.substring(0, index) + replace + this.substring(index + find.length);
	}
	return this.toString();
};
String.prototype.rplifend = function(find, replace) {
	if(typeof find == "object") {
		for(var i=0;i<find.length;i++) {
			if(this.endsWith(find[i])) return this.replaceLast(find[i], replace);
		}
		return this;
	} else {
		if(this.endsWith(find)) return this.replaceLast(find, replace);
		return this;
	}
};
