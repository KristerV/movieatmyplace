Template.host.helpers({
	items: function() {
		var events = Events.findOne({_id: Session.get('eId')});
		if (isset(events) && isset(events['host']))
			return getKeyValuePairs(events['host']);
	}
});

Template.host.events({
	'blur input': function(e, tmpl) {
		e.preventDefault();
		var movies = Events.findOne({_id: Session.get('eId')})['movies'];
		var formData = getFormData('form[name="hostform"]');
		Events.update({_id: Session.get('eId')}, {host: formData, movies: movies});
	},
});