getParams = function(param)
{
	var query = window.location.search.substring(1);

	// Make sure param actually exists
	if (isset(param) && query.indexOf("param") === -1)
		return false;

	var vars = query.split("&");
	var array = {};
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if (isset(param) && pair[0] == param)
			return pair[1];
		if (isset(pair[0]))
			array[pair[0]] = pair[1];
	}
	return isset(array) ? array : false;
}