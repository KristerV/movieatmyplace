getYoutubeId = function(url) {
	var ID = '';
	url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	if (url[1] == 'youtu.be/') {
		ID = url[2];
	} else if(url[2] !== undefined) {
		ID = url[2].split(/[^0-9a-z_]/i);
		ID = ID[0];
	} else {
		ID = url;
	}
	return ID;
}