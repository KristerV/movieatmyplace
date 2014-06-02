getKeyValuePairs = function(doc) {
	var array = [];
	$.each(doc, function(key, value){
		array.push({'key': key, 'value': value});
	});
	return array;
}