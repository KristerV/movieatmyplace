Template.addmovie.helpers({

	// Get autocomplete contents
	autocomplete: function() {
		return Session.get('movieSearch');
	},
	top: function() {
		var text = $('.addmovie input[type=text]');
		var textTop = $('.addmovie input[type=text]').offset().top;
		var textHeight = $('.addmovie input[type=text]').height();
		var top = textTop + textHeight;
		return top;
	},
});

Template.addmovie.events({

	// Add film form submit
	'submit form, click .addmovie input[type=radio]': function(e, tmpl) {
		e.preventDefault();

		var formData = getFormData('form[name="addmovie"]');
		formData['youtube'] = '';
		formData['votes'] = {};
		formData['votesSum'] = 0;
		formData['id'] = generateHash();

		// Add details from Rotten Tomatoes
		if (isset(formData['autocomplete']))
			getRottenMovieDetails(formData['id'], formData['autocomplete']);

		// Save
		Events.update({_id: Session.get('eId')}, {$push: {movies: formData}});

		// Clear autocomplete
		$('.addmovie input[name="title"]').val('');
		clearAutocomplete();
	},

	// Search for movies when typing
	'keyup .addmovie input[name=title]': function(e, tmpl) {

		// User is navigating autocomplete list
		if ([38, 40].indexOf(e.which) > -1) {

			var checked = $('input[type=radio]:checked');
			checked.prop('checked', false);

			if (e.which == 38) { // uparrow

				if (checked.length == 0)
					$('input[type=radio]').last().prop('checked', true);
				else
					checked.prev().prev().prop('checked', true);

			} else if (e.which == 40) { // downarrow

				if (checked.length == 0)
					$('input[type=radio]:first-child').prop('checked', true);
				else
					checked.next().next().prop('checked', true);
			}
		}
		// User is just typing
		else {
			// Don't search for one letter
			if (e.target.value.length < 2) {
				clearAutocomplete();
				return false;
			}

			// Only search when typing stopped, rotten has API limits:
			// 5 searches a second and 10'000 searches a day
			Meteor.clearTimeout(Session.get("typingTimer"));
			var typingTimer = Meteor.setTimeout(function(){
				$('input[name=autocomplete]').prop('checked',false);
				searchRotten(e.target.value);
			}, 500);
			Session.set("typingTimer", typingTimer);
		}
	},

	// Clear autocomplete on blur
	'blur input[name=title]': function(e, tmpl) {
		clearAutocomplete();
	}
});


var searchRotten = function(term) {
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

var getRottenMovieDetails = function(movieId, rottenId) {
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

var addRottenDetailsToMovie = function(movieId, details) {

	// Format information
	rottenData = {
		rottenId:       isset(details['id'])            ? details['id']                        : null,
		imdbId:         isset(details['alternate_ids']) ? details['alternate_ids']['imdb']     : null,
		title:          isset(details['title'])         ? details['title']                     : null,
		year:           isset(details['year'])          ? details['year']                      : null,
		studio:         isset(details['studio'])        ? details['studio']                    : null,
		thumbnail:      isset(details['posters'])       ? details['posters']['thumbnail']      : null,
		audienceRating: isset(details['ratings'])       ? details['ratings']['audience_score'] : null,
		criticRating:   isset(details['ratings'])       ? details['ratings']['critics_score']  : null,
		duration:       isset(details['runtime'])       ? details['runtime']                   : null,
		synopsis:       isset(details['synopsis'])      ? details['synopsis']                  : null,
	};

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

var clearAutocomplete = function() {
	Meteor.clearTimeout(Session.get("typingTimer"));
	Session.set('movieSearch', false);
}