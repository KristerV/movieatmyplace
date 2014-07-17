Template.movieadd.helpers({

	// Get autocomplete contents
	autocompleteLoading: function() {
		return Session.get('movieSearch') == 'loading-autocomplete' ? true : false;
	},
	autocomplete: function() {
		return Session.get('movieSearch');
	},
	style: function() {
		var text = $('.movieadd input[type=text]');
		var textTop = $('.movieadd input[type=text]').offset().top + 4;
		var textHeight = $('.movieadd input[type=text]').height();
		var top = textTop + textHeight;
		var textLeft = $('.movieadd input[type=text]').offset().left;
		return "top:" + top + "px; left:" + textLeft + "px;";
	},
});

Template.movieadd.events({

	// Add film form submit
	'submit form, click .movieadd input[type=radio]': function(e, tmpl) {
		e.preventDefault();

		var formData = getFormData('form[name="movieadd"]');
		if (formData.title.length <= 1)
			return false;
		formData['youtube'] = '';
		formData['votes'] = {};
		formData['votesSum'] = 0;
		formData['_id'] = generateHash();

		// Add details from Rotten Tomatoes
		if (isset(formData['autocomplete']))
			getRottenMovieDetails(formData['_id'], formData['autocomplete']);

		// Save
		Events.update({_id: Session.get('eId')}, {$push: {movies: formData}});

		// Clear autocomplete
		$('.movieadd input[name="title"]').val('');
		clearAutocomplete();
	},

	// Search for movies when typing
	'keyup .movieadd input[name=title]': function(e, tmpl) {

		// User is navigating autocomplete list
		if ([38, 40].indexOf(e.which) > -1) {

			var checked = $('input[type=radio]:checked');
			checked.prop('checked', false);

			if (e.which == 38) { // uparrow

				if (checked.length == 0)
					$('input[type=radio]').last().prop('checked', true);
				else
					checked.prev().prev().prop('checked', true);

			} else if (e.which == 40) { // downarrow

				if (checked.length == 0)
					$('input[type=radio]:first-child').prop('checked', true);
				else
					checked.next().next().prop('checked', true);
			}
		}
		// User is just typing
		else {
			Session.set('movieSearch', ['loading-autocomplete']);
			// Don't search for one letter
			if (e.target.value.length < 2) {
				clearAutocomplete();
				return false;
			}

			// Only search when typing stopped, rotten has API limits:
			// 5 searches a second and 10'000 searches a day
			Meteor.clearTimeout(Session.get("typingTimer"));
			var typingTimer = Meteor.setTimeout(function(){
				$('input[name=autocomplete]').prop('checked',false);
				searchRotten(e.target.value);
			}, 500);
			Session.set("typingTimer", typingTimer);
		}
	},

	// Clear autocomplete on blur
	'blur input[name=title]': function(e, tmpl) {
		// After item has been added, clear autocomplete
		Meteor.setTimeout(function(){
			clearAutocomplete();
		}, 500);
	}
});

var clearAutocomplete = function() {
	Meteor.clearTimeout(Session.get("typingTimer"));
	Session.set('movieSearch', false);
}
