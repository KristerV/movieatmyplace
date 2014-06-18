
searchYoutube = function(term) {
	var API = "http://gdata.youtube.com/feeds/api/videos?callback=?";
	var parameters = {
		q: 'asdasdasdasdasdasdpoijspdofijaspoidjfaposdjifpoasidjfpaosuidfhpi7',
		format: 5,
		'max-results': 5,
		v: 2,
		alt: 'jsonc',
	}
	$.getJSON(API, parameters, function(data){
		// Session.set('movieSearch', data.movies);
		console.log(data.data.items);
	})
	.fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
	});
}
