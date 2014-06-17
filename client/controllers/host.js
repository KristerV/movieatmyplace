Template.host.helpers({
	items: function() {
		var Event = Events.findOne({_id: Session.get('eId')});
		if (isset(Event) && isset(Event['host'])) {
			delete Event.host['friendsAddMovies'];
			delete Event.host['friendsInvite'];
			return getKeyValuePairs(Event['host']);
		}
	}
});

Template.host.events({
	'blur input, change input[type=checkbox]': function(e, tmpl) {
		e.preventDefault();
		var movies = Events.findOne({_id: Session.get('eId')})['movies'];
		var formData = getFormData('form[name="hostform"]');
		Events.update({_id: Session.get('eId')}, {$set: {host: formData}});
	},
});