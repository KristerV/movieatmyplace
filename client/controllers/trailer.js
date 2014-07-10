Template.trailer.helpers({
	youtubeTerms: function() {
		return Session.get('youtubeTerms');
	}
});

Template.trailer.events({
	'click .close': function(e, tmpl) {
		var node = $('.trailer-container');
		node.animate({right: '-50%'}).promise().done(function(){
			Session.set('youtubeTerms', null);
		});
	}
});

Template.trailer.rendered = function() {
	var node = $(this.firstNode);
	node.css('right', '-50%').animate({right: '0.5em'});
}