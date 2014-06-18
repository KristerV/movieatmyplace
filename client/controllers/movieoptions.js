Template.movieoptions.helpers({
	editMode: function() {
		return Session.get('editMode');
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

	// Edit movie
	'click .remove-movie': function(e, tmpl) {
		// var dataPath = Session.get('editData')['dataPath'];
		// var dataId = Session.get('editData')['id'];
		var item = {};
		var movieId = e.delegateTarget.id;
		var movieIndex = findMovieIndexInCollectionById(movieId);
		item['movies'] = {id: movieId};
		Events.update({_id: Session.get('eId')}, {$pull: item});
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
