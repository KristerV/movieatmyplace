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

Template.editData.helpers({
	items: function() {
		var data = Session.get('editData');
		data = {youtube: data['youtube']};
		return getKeyValuePairs(data);
	}
});
Template.editData.events({
	'submit form': function(e, tmpl) {

		// Prevent default html action
		e.preventDefault();

		// Gather data
		var buttonPressed = $(":input[type=submit]:focus").attr('name');
		var dataPath = Session.get('editData')['dataPath'];
		var dataId = Session.get('editData')['id'];

		// Different button reactions
		if (buttonPressed == 'save') {

			// Get old data from DB
			var Event = Events.findOne({_id: Session.get('eId')});
			for (var i = 0; i < dataPath.length; i++)
				Event = Event[dataPath[i]]

			// Get new data from form
			var formData = getFormData('form[name="editDataForm"]');

			// Combine old and new
			var data = $.extend(Event, formData);

			// Save the data with correct dataPath
			var save = {};
			save[dataPath.join('.')] = data;
			Events.update({_id: Session.get('eId')}, {$set: save});
			
		} else if (buttonPressed == 'delete') {
			var item = {};
			item[dataPath[0]] = {id: dataId};
			Events.update({_id: Session.get('eId')}, {$pull: item});
			Session.set('youtubePlayer', null);
			Session.set('topTrailer', null);
		}

		Session.set('editData', null);
	},
});
