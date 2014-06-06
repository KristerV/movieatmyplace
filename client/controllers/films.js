Template.films.helpers({
	film: function() {
		var Event = Events.findOne({_id: Session.get('eventId')});
		if (isset(Event)) {
			return Event['films'];
		}
	},
});

Template.films.events({
	'submit form': function(e, tmpl) {
		e.preventDefault();

		var formData = getFormData('form[name="addfilm"]');
		formData['trailer'] = '';
		formData['votes'] = {};
		formData['id'] = generateHash();

		Events.update({_id: Session.get('eventId')}, {$push: {films: formData}});
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
		var data = Events.findOne({_id: Session.get('eventId')});
		data = data['films'][itemIndex];
		data['dataPath'] = ['films', itemIndex];
		Session.set('editData', data);
	},
	'click .add-point, click .remove-point': function(e, tmpl) {
		var userId = localStorage.getItem("userId");
		var buttonClass = e.currentTarget.className;
		var itemIndex = $('.films .film').index($(e.delegateTarget));
		var data = {};
		var value = Events.findOne({_id: Session.get('eventId')}).films[itemIndex].votes[userId];
		if (buttonClass.indexOf("add-point") > -1) {
			value = value === 1 ? 0 : 1;
		} else if (buttonClass.indexOf("remove-point") > -1) {
			value = value === -1 ? 0 : -1;
		}
		data['films.' + itemIndex + '.votes.' + userId] = value;
		Events.update({_id: Session.get('eventId')}, {$set: data});
		console.log(Events.findOne({_id: Session.get('eventId')}).films[itemIndex].name);
		console.log(Events.findOne({_id: Session.get('eventId')}).films[itemIndex].votes);
	},


});