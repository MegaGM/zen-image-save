$( document ).on( 'ready', function ( e ) {
	var all = $( '[data-i18n]' );
	all.each(function ( i, element ) {
		var el = $( element );
		el.text( chrome.i18n.getMessage( el.attr( 'data-i18n' ) ) );
	});
});
