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
	'blur input, change input[type=checkbox]:not(input[name=email])': function(e, tmpl) {
		e.preventDefault();
		var movies = Events.findOne({_id: Session.get('eId')})['movies'];
		var formData = getFormData('form[name="hostform"]');
		delete formData.Email;
		Events.update({_id: Session.get('eId')}, {$set: {host: formData}});
	},
	'blur input[name=Email]': function(e, tmpl) {
		
		if (!isValidEmailAddress(e.currentTarget.value))
			return false;

		var editHash = Events.findOne({_id: Session.get('eId')}).editHash;
		var editLink = 'movieat.mp/?eId=' + Session.get('eId') + '&edit=' + editHash;

		Meteor.call('sendEmailEditLink', e.currentTarget.value, Session.get('eId'));
	}
});

