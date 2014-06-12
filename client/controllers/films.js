

Template.movies.helpers({

	// Get movies from database
	movies: function() {
		var Event = Events.findOne({_id: Session.get('eId')}, {sort: {'movies.$.votesSum': -1}});
		if (isset(Event)) {
			var ordered = sortObject(Event['movies']);
			if (!isset(ordered))
				return false;
			Session.set("topTrailer", ordered[0].youtube);
			return ordered;
		}
	},

	// Get amount of votes
	vote: function() {
		var vote = this.votes[localStorage.getItem('userId')];
		if (vote == 1)
			return 'like';
		if (vote == 0)
			return 'undecided';
		if (vote == -1)
			return 'dislike';
	},

	// Get autocomplete contents
	autocomplete: function() {
		return Session.get('movieSearch');
	}
});

Template.movies.events({

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
		Meteor.clearTimeout(Session.get("typingTimer"));
		Session.set('movieSearch', false);
	},

	// Display film options
	'mouseenter .movie': function(e, tmpl) {
		$('.movies .options').css("display", "none");
		$(e.currentTarget.firstElementChild).css("display", "table");
	},

	// Undisplay film options
	'mouseleave .options': function(e, tmpl) {
		$(e.currentTarget).css("display", "none");
	},

	// Search for movies when typing
	'keyup .addmovie input[name=title]': function(e, tmpl) {

		// Don't search for one letter
		if (e.target.value.length < 2) {
			Meteor.clearTimeout(Session.get("typingTimer"));
			Session.set('movieSearch', false);
			return false;
		}

		// Only search when typing stopped, rotten has API limits:
		// 5 searches a second and 10'000 searches a day
		Meteor.clearTimeout(Session.get("typingTimer"));
		var typingTimer = Meteor.setTimeout(function(){
			$('input[name=autocomplete]').attr('checked',false);
			searchRotten(e.target.value);
		}, 500);
		Session.set("typingTimer", typingTimer);
	}
});

Template.movieoptions.events({

	// Edit movie
	'click .edit-movie': function(e, tmpl) {
		var itemIndex = $(e.delegateTarget).attr('originalOrder');
		var data = Events.findOne({_id: Session.get('eId')});
		data = data['movies'][itemIndex];
		data['dataPath'] = ['movies', itemIndex];
		Session.set('editData', data);
	},

	// Add point to movie
	'click .add-point, click .remove-point': function(e, tmpl) {

		// Get basic info
		var userId = localStorage.getItem("userId");
		var buttonClass = e.currentTarget.className;
		var itemIndex = $(e.delegateTarget).attr('originalOrder');
		var Event = Events.findOne({_id: Session.get('eId')});
		var votes = Event.movies[itemIndex].votes;
		var userVote = votes[userId];
		delete votes[userId]; // Delete so it wont disturb when calculating total

		// Figure out what point to give
		if (buttonClass.indexOf("add-point") > -1)
			userVote = userVote === 1 ? 0 : 1;
		else if (buttonClass.indexOf("remove-point") > -1)
			userVote = userVote === -1 ? 0 : -1;

		// Calculate sum of votes
		var votesSum = userVote;
		$.each(votes, function(usr, val) {votesSum += val});

		// Save data
		var data = {};
		data['movies.' + itemIndex + '.votes.' + userId] = userVote;
		data['movies.' + itemIndex + '.votesSum'] = votesSum;
		Events.update({_id: Session.get('eId')}, {$set: data});
	},

	// See the trailer of movie
	'click .see-trailer': function(e, tmpl) {
		var userId = localStorage.getItem("userId");
		var buttonClass = e.currentTarget.className;
		var itemIndex = $(e.delegateTarget).attr('originalOrder');
		var Event = Events.findOne({_id: Session.get('eId')});
		var youtubeLink = Event.movies[itemIndex].youtube;
		if (!isset(youtubeLink)) {
			data = Event['movies'][itemIndex];
			data['dataPath'] = ['movies', itemIndex];
			Session.set('editData', data);
		} else {
			Session.set('youtubePlayer', youtubeLink);
		}
	}


});

var searchRotten = function(term) {
	var API = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?callback=?";
	var parameters = {
		q: term,
		page_limit: 10,
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

findMovieIndexInCollectionById = function(movieId) {
	var Event = Events.findOne({_id: Session.get('eId')});
	var movies = Event.movies;

	for (var i = 0; i < movies.length; i++)
		if (movies[i]['id'] == movieId)
			return i;
}