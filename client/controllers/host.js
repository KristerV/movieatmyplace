Template.host.helpers({
	items: function() {
		var events = Events.findOne({_id: Session.get('eventId')});
		if (isset(events) && isset(events['host']))
			return getKeyValuePairs(events['host']);
	}
});

Template.host.events({
	'keyup input': function(e, tmpl) {
		e.preventDefault();
		var formData = getFormData('form[name="hostform"]');
		Events.upsert({_id: Session.get('eventId')}, {host: formData});
	},
});