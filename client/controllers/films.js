

Template.films.helpers({
	films: function() {
		var Event = Events.findOne({_id: Session.get('eId')}, {sort: {'films.$.votesSum': -1}});
		if (isset(Event)) {
			var ordered = sortObject(Event['films']);
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
		return Session.get('filmSearch');
	}
});

Template.films.events({
	'submit form': function(e, tmpl) {
		e.preventDefault();

		var formData = getFormData('form[name="addfilm"]');
		formData['youtube'] = '';
		formData['votes'] = {};
		formData['votesSum'] = 0;
		formData['id'] = generateHash();

		Events.update({_id: Session.get('eId')}, {$push: {films: formData}});
	},
	'mouseenter .film': function(e, tmpl) {
		$('.films .options').css("display", "none");
		$(e.currentTarget.firstElementChild).css("display", "table");
	},
	'mouseleave .options': function(e, tmpl) {
		$(e.currentTarget).css("display", "none");
	},
	'keyup input[name=addfilm]': function(e, tmpl) {

		// Don't search for one letter
		if (e.target.value.length < 2) {
			Meteor.clearTimeout(Session.get("typingTimer"));
			Session.set('filmSearch', false);
			return false;
		}

		// Only search when typing stopped, rotten has API limits:
		// 5 searches a second and 10'000 searches a day
		Meteor.clearTimeout(Session.get("typingTimer"));
		var typingTimer = Meteor.setTimeout(function(){
			searchRotten(e.target.value);
		}, 500);
		Session.set("typingTimer", typingTimer);
	}
});

Template.filmoptions.events({
	'click .edit-film': function(e, tmpl) {
		var itemIndex = $(e.delegateTarget).attr('originalOrder');
		var data = Events.findOne({_id: Session.get('eId')});
		data = data['films'][itemIndex];
		data['dataPath'] = ['films', itemIndex];
		Session.set('editData', data);
	},
	'click .add-point, click .remove-point': function(e, tmpl) {
		var userId = localStorage.getItem("userId");
		var buttonClass = e.currentTarget.className;
		var itemIndex = $(e.delegateTarget).attr('originalOrder');
		var Event = Events.findOne({_id: Session.get('eId')});
		var votes = Event.films[itemIndex].votes;
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
		data['films.' + itemIndex + '.votes.' + userId] = userVote;
		data['films.' + itemIndex + '.votesSum'] = votesSum;
		Events.update({_id: Session.get('eId')}, {$set: data});
	},
	'click .see-trailer': function(e, tmpl) {
		var userId = localStorage.getItem("userId");
		var buttonClass = e.currentTarget.className;
		var itemIndex = $(e.delegateTarget).attr('originalOrder');
		var Event = Events.findOne({_id: Session.get('eId')});
		var youtubeLink = Event.films[itemIndex].youtube;
		if (!isset(youtubeLink)) {
			data = Event['films'][itemIndex];
			data['dataPath'] = ['films', itemIndex];
			Session.set('editData', data);
		} else {
			Session.set('youtubePlayer', youtubeLink);
		}
	}


});

var searchRotten = function(term) {
	var link = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?callback=?";
	var parameters = {
		q: term,
		page_limit: 10,
		page: 1,
		apikey: 'h7r36fsnbz7bzb87pz86tyh5',
	}
	$.getJSON(link, parameters, function(data){
		Session.set('filmSearch', data.movies);
	})
	.fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
	});
}