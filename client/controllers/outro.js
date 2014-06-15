Template.outro.events({
	'click #about': function(e, tmpl) {
		if ( $( "#outro-hidden" ).is( ":hidden" ) ) {
			$( "#outro-hidden" ).css('display', 'flex');
			$('html,body').animate({scrollTop: $(document).height() - $(window).height()}, 1000);
		} else {
			$( "#outro-hidden" ).css('display', 'none');
		}
	}
});