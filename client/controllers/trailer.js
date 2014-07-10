Template.trailer.helpers({
	youtubeTerms: function() {
		return Session.get('youtubeTerms');
	}
});

Template.trailer.events({
	'click p': function(e, tmpl) {
		var node = $('.trailer-container');
		node.addClass('trailer-hidden').bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
			Session.set('youtubeTerms', null);
		});
	}
});

Template.trailer.rendered = function() {
	var node = $(this.firstNode);
	Meteor.setTimeout(function(){
		node.removeClass('trailer-hidden');
	}, 1);
}