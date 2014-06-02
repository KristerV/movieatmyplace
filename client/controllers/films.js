Template.films.helpers({
	film: function() {
		var event = Events.findOne({_id: Session.get('eventId')});
		console.log(isset(event));
		if (isset(event)) {
			console.log(event['films']);
			return event['films'];
		}
	},
});

Template.films.events({
	'submit form': function(e, tmpl) {
		e.preventDefault();
		var formData = getFormData('form[name="addfilm"]');
		var event = Events.findOne({_id: Session.get('eventId')});
		console.log(event);
		event.films.push(formData);
		Events.upsert({_id: Session.get('eventId')}, event);
	},
});