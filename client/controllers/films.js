Template.films.helpers({
	films: function() {
		var Event = Events.findOne({_id: Session.get('eId')}, {sort: {'films.$.votesSum': -1}});
		if (isset(Event))
			return sortObject(Event['films']);
	},
	vote: function() {
		var vote = this.votes[localStorage.getItem('userId')];
		if (vote == 1)
			return 'like';
		if (vote == 0)
			return 'undecided';
		if (vote == -1)
			return 'dislike';
	}
});

Template.films.events({
	'submit form': function(e, tmpl) {
		e.preventDefault();

		var formData = getFormData('form[name="addfilm"]');
		formData['trailer'] = '';
		formData['votes'] = {};
		formData['id'] = generateHash();

		Events.update({_id: Session.get('eId')}, {$push: {films: formData}});
	},
	'mouseenter .film': function(e, tmpl) {
		$('.films .options').css("display", "none");
		$(e.currentTarget.firstElementChild).css("display", "table");
	},
	'mouseleave .options': function(e, tmpl) {
		$(e.currentTarget).css("display", "none");
	}
});

Template.filmoptions.events({
	'click .edit-film': function(e, tmpl) {
		var itemIndex = $('.films .film').index($(e.delegateTarget));
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


});