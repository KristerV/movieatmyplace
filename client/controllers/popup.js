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
		delete data['votes'];
		delete data['votesSum'];
		return getKeyValuePairs(data);
	}
});
Template.editData.events({
	'submit form': function(e, tmpl) {
		e.preventDefault();
		var buttonPressed = $(":input[type=submit]:focus").attr('name');
		var dataPath = Session.get('editData')['dataPath'].join('.');
		var dataId = Session.get('editData')['id'];
		if (buttonPressed == 'save') {
			var formData = getFormData('form[name="editDataForm"]');
			var save = {};
			save[dataPath] = formData;
			Events.update({_id: Session.get('eventId')}, {$set: save});
		} else if (buttonPressed == 'delete') {
			Events.update({_id: Session.get('eventId')}, {$pull: {films: {id: dataId}}});
		}

		Session.set('editData', null);
	}
});
