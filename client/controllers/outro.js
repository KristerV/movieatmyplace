Template.outro.events({
	'click #about': function(e, tmpl) {
		if ( $( "#outro-hidden" ).is( ":hidden" ) ) {
			$( "#outro-hidden" ).css('display', 'flex');
			var bottom = $(document).height() - $(window).height();
			var outroTop = $('.outro').offset().top + 5;
			var scrolltop = bottom < outroTop ? bottom : outroTop;
			$('html,body').animate({scrollTop: scrolltop}, 1000);
		} else {
			$( "#outro-hidden" ).css('display', 'none');
		}
	}
});