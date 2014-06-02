Template.host.helpers({
	items: function() {
		var events = Events.findOne({_id: Session.get('eventId')});
		if (isset(events) && isset(events['host']))
			return getKeyValuePairs(events['host']);
	}
});

Template.host.events({
	'submit form': function(e, tmpl) {
		e.preventDefault();
		var formData = getFormData('input');
		Events.upsert({_id: Session.get('eventId')}, {host: formData});
	},
});