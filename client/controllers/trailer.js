Template.trailer.helpers({
	youtubeTerms: function() {
		return Session.get('youtubeTerms');
	}
});

Template.trailer.events({
	'click p': function(e, tmpl) {
		var node = $('.trailer-container');
		if ($(document).width() <= 800)
			node.animate({right: '-100%'}).promise().done(function(){
				Session.set('youtubeTerms', null);
			});
		else
			node.animate({right: '-50%'}).promise().done(function(){
				Session.set('youtubeTerms', null);
			});
	}
});

Template.trailer.rendered = function() {
	var node = $(this.firstNode);
	node.removeClass('trailer-hidden');
	if ($(document).width() <= 800)
		node.css('right', '-100%').animate({right: '0'});
	else
		node.css('right', '-50%').animate({right: '0.5em'});
}