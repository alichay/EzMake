require("./stringutil.js");
module.exports = function(lang) {
	return require("./lang/"+lang.toLowerCase());
};
