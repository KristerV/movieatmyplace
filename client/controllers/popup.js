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
		var dataPath = Session.get('editData')['dataPath'];
		var dataId = Session.get('editData')['id'];
		if (buttonPressed == 'save') {
			var formData = getFormData('form[name="editDataForm"]');
			var save = {};
			save[dataPath.join('.')] = formData;
			Events.update({_id: Session.get('eId')}, {$set: save});
		} else if (buttonPressed == 'delete') {
			var item = {};
			item[dataPath[0]] = {id: dataId};
			Events.update({_id: Session.get('eId')}, {$pull: item});
		}

		Session.set('editData', null);
	}
});
