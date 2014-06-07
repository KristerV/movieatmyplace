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
		var films = Events.findOne({_id: Session.get('eId')})['films'];
		var formData = getFormData('form[name="hostform"]');
		Events.update({_id: Session.get('eId')}, {host: formData, films: films});
	},
});