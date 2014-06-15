Template.host.helpers({
	items: function() {
		var Event = Events.findOne({_id: Session.get('eId')});
		if (isset(Event) && isset(Event['host']))
			return getKeyValuePairs(Event['host']);
	}
});

Template.host.events({
	'blur input': function(e, tmpl) {
		e.preventDefault();
		var movies = Events.findOne({_id: Session.get('eId')})['movies'];
		var formData = getFormData('form[name="hostform"]');
		Events.update({_id: Session.get('eId')}, {$set: {host: formData}});
	},
});