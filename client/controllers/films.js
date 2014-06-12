

Template.movies.helpers({
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
	vote: function() {
		var vote = this.votes[localStorage.getItem('userId')];
		if (vote == 1)
			return 'like';
		if (vote == 0)
			return 'undecided';
		if (vote == -1)
			return 'dislike';
	},
	autocomplete: function() {
		return Session.get('movieSearch');
	}
});

Template.movies.events({
	'submit form': function(e, tmpl) {
		e.preventDefault();

		var formData = getFormData('form[name="addmovie"]');
		formData['youtube'] = '';
		formData['votes'] = {};
		formData['votesSum'] = 0;
		formData['id'] = generateHash();

		// Add details from Rotten Tomatoes
		if (isset(formData['autocomplete'])) {
			formData['title'] = formData['rottenTitle'];
			getRottenMovieDetails(formData['id'], formData['autocomplete']);
		}

		// Save
		Events.update({_id: Session.get('eId')}, {$push: {movies: formData}});

		// Clear autocomplete
		$('.addmovie input[name="title"]').val('');
		Meteor.clearTimeout(Session.get("typingTimer"));
		Session.set('movieSearch', false);
	},
	'mouseenter .movie': function(e, tmpl) {
		$('.movies .options').css("display", "none");
		$(e.currentTarget.firstElementChild).css("display", "table");
	},
	'mouseleave .options': function(e, tmpl) {
		$(e.currentTarget).css("display", "none");
	},
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
	'click .edit-movie': function(e, tmpl) {
		var itemIndex = $(e.delegateTarget).attr('originalOrder');
		var data = Events.findOne({_id: Session.get('eId')});
		data = data['movies'][itemIndex];
		data['dataPath'] = ['movies', itemIndex];
		Session.set('editData', data);
	},
	'click .add-point, click .remove-point': function(e, tmpl) {
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
		rottenId: details.id,
		imdbId: details.alternate_ids.imdb,
		title: details.title,
		year: details.year,
		studio: details.studio,
		thumbnail: details.posters.thumbnail,
		audienceRating: details.ratings.audience_score,
		criticRating: details.ratings.critics_score,
		duration: details.runtime,
		synopsis: details.synopsis,
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
		rottenData[key] = value;
	});

	// Save
	var data = {movies: []};
	data['movies'][movieIndex] = rottenData;
	Events.update({_id: Session.get('eId')}, {$set: data});
}

findMovieIndexInCollectionById = function(movieId) {
	var Event = Events.findOne({_id: Session.get('eId')});
	var movies = Event.movies;

	for (var i = 0; i < movies.length; i++)
		if (movies[i]['id'] == movieId)
			return i;
}