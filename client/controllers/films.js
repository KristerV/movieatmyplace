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

		var Event = Events.findOne({_id: Session.get('eventId')});
		if (!isset(Event['films']))
			Event['films'] = [];

		var formData = getFormData('form[name="addfilm"]');
		formData['id'] = generateHash();
		Event.films.push(formData);

		Events.upsert({_id: Session.get('eventId')}, {$set: {films: Event.films}});
	},
	'mouseenter .film': function(e, tmpl) {
		$('.films .options').css("display", "none");
		$(e.currentTarget.firstElementChild).css("display", "table");
	},
	'mouseleave .options': function(e, tmpl) {
		$(e.currentTarget).css("display", "none");
	}
});