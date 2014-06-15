Template.host.helpers({
	items: function() {
		var Event = Events.findOne({_id: Session.get('eId')});
		if (isset(Event) && isset(Event['host'])) {
			console.log(Event.host);
			delete Event.host['friendsAddMovies'];
			delete Event.host['friendsInvite'];
			return getKeyValuePairs(Event['host']);
		}
	}
});

Template.host.events({
	'blur input': function(e, tmpl) {
		e.preventDefault();
		var movies = Events.findOne({_id: Session.get('eId')})['movies'];
		var formData = getFormData('form[name="hostform"]');
		console.log(formData);
		Events.update({_id: Session.get('eId')}, {$set: {host: formData}});
	},
});