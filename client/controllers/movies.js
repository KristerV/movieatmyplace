Template.movies.helpers({

	// Get movies from database
	movies: function() {
		var Event = Events.findOne({_id: Session.get('eId')}, {sort: {'movies.$.votesSum': -1}});
		if (isset(Event)) {
			var ordered = sortObject(Event['movies']);
			if (!isset(ordered))
				return false;
			Session.set("topTrailer", ordered[0].poster);
			return ordered;
		}
	},

	// Get amount of votes
	vote: function() {
		var vote = this.votes[localStorage.getItem('userId')];
		if (vote === 1)
			return 'like';
		if (vote === 0)
			return '';
		if (vote === -1)
			return 'dislike';
	},
	isEditMode: function() {
		return Session.get("editMode");
	}
});

Template.movies.events({

	'click .vote': function(e, tmpl) {

		var button = $(e.currentTarget);
		if (button.hasClass('like'))
			vote = 'dislike';
		else if (button.hasClass('dislike'))
			vote = 'none';
		else
			vote = 'like';

		var movieId = $(e.target).parent().parent().attr('id');
		$('#' + movieId).removeClass('like dislike none');

		changeMovieVote(e, vote);
		Meteor.setTimeout(function(){displayVoteResult(movieId, vote)}, 1);
	},
	'click .delete': function(e, tmpl) {
		var item = {};
		var movieId = $(e.target).parent().attr('id');
		item['movies'] = {id: movieId};
		Events.update({_id: Session.get('eId')}, {$pull: item});
	},
	'mouseenter .vote': function(e, tmpl) {
		$(e.target).parent().removeClass('total-votes-text').addClass('my-vote-text');
		Meteor.setTimeout(function(){
			$(e.target).parent().removeClass('my-vote-text');
		}, 1000);
	},
	'mouseenter .votesSum': function(e, tmpl) {
		$(e.target).parent().removeClass('my-vote-text').addClass('total-votes-text');
		Meteor.setTimeout(function(){
			$(e.target).parent().removeClass('total-votes-text');
		}, 1000);
	},
});

findMovieIndexInCollectionById = function(movieId) {
	var Event = Events.findOne({_id: Session.get('eId')});
	var movies = Event.movies;

	for (var i = 0; i < movies.length; i++)
		if (movies[i]['id'] == movieId)
			return i;
}

changeMovieVote = function(e, vote) {

	// Get basic info
	var userId = localStorage.getItem("userId");
	var itemIndex = $(e.target).parent().parent().attr('originalOrder');
	var Event = Events.findOne({_id: Session.get('eId')});
	var votes = Event.movies[itemIndex].votes;
	var userVote = votes[userId];
	delete votes[userId]; // Delete so it wont disturb when calculating total

	// Figure out what point to give
	if (vote == 'like')
		userVote = 1;
	else if (vote == 'dislike')
		userVote = -1;
	else
		userVote = 0;

	// Calculate sum of votes
	var votesSum = userVote;
	$.each(votes, function(usr, val) {votesSum += val});

	// Save data
	var data = {};
	data['movies.' + itemIndex + '.votes.' + userId] = userVote;
	data['movies.' + itemIndex + '.votesSum'] = votesSum;
	Events.update({_id: Session.get('eId')}, {$set: data});
}

displayVoteResult = function(movieId, vote) {
	$('#' + movieId).addClass(vote);
	Meteor.setTimeout(function(){
		$('#' + movieId).removeClass(vote);
	}, 1000);
}