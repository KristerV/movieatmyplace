getDomain = function()
{
	var query = document.URL;
	var array = query.split("?");
	return array;
}
