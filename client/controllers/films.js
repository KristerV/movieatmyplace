Template.films.helpers({
	film: function() {
		var event = Events.findOne({_id: Session.get('eventId')});
		if (isset(event)) {
			return event['films'];
		}
	},
});

Template.films.events({
	'submit form': function(e, tmpl) {
		e.preventDefault();
		var formData = getFormData('form[name="addfilm"]');
		formData['id'] = generateHash();
		var event = Events.findOne({_id: Session.get('eventId')});
		event.films.push(formData);
		Events.upsert({_id: Session.get('eventId')}, event);
	},
	'mouseenter .film': function(e, tmpl) {
		$('.films .options').css("display", "none");
		$(e.currentTarget.firstElementChild).css("display", "table");
	},
	'mouseleave .options': function(e, tmpl) {
		$(e.currentTarget).css("display", "none");
	}
});