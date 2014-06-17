Template.popup.helpers({
	contentTemplate: function() {
		return Template['editData'];
	},
});

Template.popup.events({
	'click .popup-background': function(e, tmpl) {
		if (e.target.className.indexOf('middle') !== -1)
			Session.set('editData', null);
	}
});

