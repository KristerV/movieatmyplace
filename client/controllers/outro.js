Template.outro.events({
	'click #about': function(e, tmpl) {
		if ( $( "#outro-hidden" ).is( ":hidden" ) ) {
			$( "#outro-hidden" ).css('display', 'flex');
			var bottom = $(document).height() - $(window).height();
			var outroTop = $('.outro').offset().top + 5;
			var scrolltop = bottom < outroTop ? bottom : outroTop;
			$('html,body').animate({scrollTop: scrolltop}, 1000);
			$('.outro').css("background-color", 'rgba(230,230,230,0.9)');
			$('.section:last-child').removeClass("with-background-image");
			$('.section:last-child').addClass("no-background-image");
		} else {
			$('.outro').css("background-color", 'none');
			$( "#outro-hidden" ).slideUp(1000);
			if ($('.backstretch').length > 0) {
				$('.section:last-child').removeClass("no-background-image");
				$('.section:last-child').addClass("with-background-image");
			}
		}
	}
});