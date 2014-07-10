Template.movies.helpers({

	// Get movies from database
	movies: function() {
		var Event = Events.findOne({_id: Session.get('eId')}, {sort: {'movies.$.votesSum': -1}});
		if (isset(Event)) {
			var ordered = reformatMovies(Event['movies'], true);
			if (!isset(ordered))
				return false;
			return ordered;
			// Perhaps useful some other time
			// var ordered = Event.movies.sort(function(a, b){
			// 	return a.votesSum < b.votesSum;
			// });
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
		// Disabled along with movie sorting
		Meteor.setTimeout(function(){displayVoteResult(movieId, vote)}, 1);
	},
	
	'click .delete': function(e, tmpl) {
		var item = {};
		var movieId = $(e.target).parent().attr('id');
		item['movies'] = {_id: movieId};
		Events.update({_id: Session.get('eId')}, {$pull: item});
	},
	
	/*'mouseenter .vote': function(e, tmpl) {
		$('.tooltip-my-vote, .tooltip-total-votes').removeClass('tooltip-my-vote tooltip-total-votes');
		$(e.target).parent().addClass('tooltip-my-vote');
		Meteor.setTimeout(function(){
			$(e.target).parent().removeClass('tooltip-my-vote');
		}, 1000);
	},
	
	'mouseenter .votesSum': function(e, tmpl) {
		$('.tooltip-my-vote, .tooltip-total-votes').removeClass('tooltip-my-vote tooltip-total-votes');
		$(e.target).parent().addClass('tooltip-total-votes');
		Meteor.setTimeout(function(){
			$(e.target).parent().removeClass('tooltip-total-votes');
		}, 1000);
	},*/
});

findMovieIndexInCollectionById = function(movieId) {
	var Event = Events.findOne({_id: Session.get('eId')});
	var movies = Event.movies;

	for (var i = 0; i < movies.length; i++)
		if (movies[i]['_id'] == movieId)
			return i;
}

Template.movies.rendered = function() {
	this.firstNode._uihooks = {
		moveElement: function (node, next) {
			console.log(node);
			$(node).stop(true, true).animate({height: 'toggle', opacity: 0 }, 'slow').promise().done(function(){
				$(node).insertBefore(next).stop(true, true).animate({ height: 'toggle', opacity: 1 }, 'slow');
			});
		},
		removeElement: function (node, next) {
			$(node).slideUp().promise().done(function(){
				$(node).remove();
			});
		},
		insertElement: function (node, next) {
			$(node).insertBefore(next).hide().slideDown();
		},
	};
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
	$('#' + movieId + " .vote").addClass('animating');
	Meteor.setTimeout(function(){
		$('#' + movieId).removeClass(vote);
		$('#' + movieId + " .vote").removeClass('animating');
	}, 2000);
}