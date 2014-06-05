Template.popup.helpers({
	contentTemplate: function() {
		return Template['editData'];
	},
});

Template.editData.helpers({
	items: function() {
		var data = Session.get('editData');
		delete data['dataPath'];
		delete data['id'];
		return getKeyValuePairs(data);
	}
});
Template.editData.events({
	'submit form': function(e, tmpl) {
		e.preventDefault();
		var buttonPressed = $(":input[type=submit]:focus").attr('name');
		if (buttonPressed == 'save') {
			var dataPath = Session.get('editData')['dataPath'];
			var formData = getFormData('form[name="editDataForm"]');
			var save = {};
			save[dataPath.join('.')] = formData;
			Events.update({_id: Session.get('eventId')}, {$set: save});
		}

		Session.set('editData', null);
	}
});