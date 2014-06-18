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
			return '';
		if (vote == -1)
			return 'dislike';
	}
});

Template.movies.events({

	// Display film options
	'mouseenter .movie': function(e, tmpl) {
		$('.movies .options').css("display", "none");
		$(e.currentTarget.firstElementChild).css("display", "table");
	},

	// Undisplay film options
	'mouseleave .options': function(e, tmpl) {
		$(e.currentTarget).css("display", "none");
	},
});

findMovieIndexInCollectionById = function(movieId) {
	var Event = Events.findOne({_id: Session.get('eId')});
	var movies = Event.movies;

	for (var i = 0; i < movies.length; i++)
		if (movies[i]['id'] == movieId)
			return i;
}