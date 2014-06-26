
searchRotten = function(term) {
	var API = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?callback=?";
	var parameters = {
		q: term,
		page_limit: 5,
		page: 1,
		apikey: 'h7r36fsnbz7bzb87pz86tyh5',
	}
	$.getJSON(API, parameters, function(data){
		Session.set('movieSearch', data.movies);
	})
	.fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
	});
}

getRottenMovieDetails = function(movieId, rottenId) {
	var API = "http://api.rottentomatoes.com/api/public/v1.0/movies/" + rottenId + ".json?callback=?";
	var parameters = {
		apikey: 'h7r36fsnbz7bzb87pz86tyh5',
	}
	$.getJSON(API, parameters, function(data){
		addRottenDetailsToMovie(movieId, data);
	})
	.fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
	});
}

addRottenDetailsToMovie = function(movieId, details) {

	// Format information
	console.log(details);
	rottenData = {
		rottenId:       isset(details['id'])            ? details['id']                        : null,
		imdbId:         isset(details['alternate_ids']) ? details['alternate_ids']['imdb']     : null,
		title:          isset(details['title'])         ? details['title']                     : null,
		year:           isset(details['year'])          ? details['year']                      : null,
		studio:         isset(details['studio'])        ? details['studio']                    : null,
		thumbnail:      isset(details['posters'])       ? details['posters']['thumbnail']      : null,
		poster:      	isset(details['posters'])       ? details['posters']['original']       : null,
		audienceRating: isset(details['ratings'])       ? details['ratings']['audience_score'] : null,
		criticRating:   isset(details['ratings'])       ? details['ratings']['critics_score']  : null,
		duration:       isset(details['runtime'])       ? details['runtime']                   : null,
		synopsis:       isset(details['synopsis'])      ? details['synopsis']                  : null,
	};

	rottenData['poster'] = rottenData['poster'].replace('_tmb.jpg', '_ori.jpg');

	var actors = [];
	$.each(details.abridged_cast, function(actor) {
		actors.push(actor.name);
	});
	rottenData['cast'] = actors.join(', ');

	var directors = [];
	$.each(details.abridged_directors, function(director) {
		directors.push(director.name);
	});
	rottenData['directors'] = directors.join(', ');

	rottenData['genres'] = details.genres.join(', ');

	// Add already saved data (like votes)
	var movieIndex = findMovieIndexInCollectionById(movieId);
	var movie = Events.findOne({_id: Session.get('eId')}).movies[movieIndex];
	$.each(movie, function(key, value) {
		if (!isset(rottenData[key]))
			rottenData[key] = value;
	});

	// Save
	var data = {};
	data['movies.' + movieIndex] = rottenData;
	Events.update({_id: Session.get('eId')}, {$set: data});
}