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
	}
});