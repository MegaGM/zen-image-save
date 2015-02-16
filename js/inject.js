/**
 * Let's start spy and store mouse coordinates
 */
var mouse = {};
$(window).on('mousemove', function ( e ) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
});


/**
 * Get settings from storage and put them to global variable ( I know it's not the best way, but suitable )
 */
var ZenImageSave = {};
chrome.storage.sync.get({
	ctrl: true,
	alt: true,
	shift: false,
	key: 90 // 90 === Z ( default combination Ctrl + Alt + Z )
}, function ( items ) {
	ZenImageSave.ctrl = items.ctrl;
	ZenImageSave.alt = items.alt;
	ZenImageSave.shift = items.shift;
	ZenImageSave.key = items.key;
	console.log( 'CLIENT SCRIPT chrome.storage.sync.get', items );
});


/**
 * Set up listener for our magic hotkey combination
 */
$(window).on('keydown', function ( e ) {
	/**
	 * Check pressed combination
	 */
	if ( ZenImageSave.ctrl !== e.ctrlKey ) return;
	if ( ZenImageSave.alt !== e.altKey ) return;
	if ( ZenImageSave.shift !== e.shiftKey ) return;
	if ( ZenImageSave.key !== e.which ) return;

	console.log( 'HERE IT IS', e );
	var url;

	/**
	 * If we on VK.com page and there is 'Open original button'
	 * then save it and return
	 */
	var VK_el = $( '#pv_open_original' );
	if ( VK_el.length ) {
		if ( !$( '#layer_wrap' ).is( ':visible' ) ) return;
		url = VK_el.attr( 'href' ) || null;
		return doSave( url );
	}


	/**
	 * If we on a page, which contains 'img' tag only
	 * then save it and return
	 */
	var img = document.querySelector( 'img' );
	if ( img && img.parentNode === document.querySelector( 'body' ) ) {
		url = img.src || null;
		return doSave( url );
	}


	/**
	 * Last try
	 */
	var elements = $.touching({x: mouse.x, y: mouse.y}, 'img');
	if ( elements.length ) {
		var el = elements.length > 1 ? elements[ elements.length - 1 ] : elements[ 0 ];
		el = $( el );
		url = el.attr( 'src' ) || el.attr( 'href' ) || null;
		return doSave( url );
	}
});


/**
 * Send a message to backend 'bg.js'
 */
function doSave ( url ) {
	console.log( 'doSave was called' );
	if ( !url ) return;


	/**
	 * Sanitize image url a little bit
	 */
	if ( 0 === url.indexOf( '//' ) ) {
		url = url.replace( '//', 'http://' );
	}


	if ( -1 === url.indexOf( 'http://' ) && -1 === url.indexOf( 'https://' ) ) {
		url = document.location.href + url;
	}


	/**
	 * Send command to download it to bg.js
	 */
	chrome.runtime.sendMessage({key: 'download', url: url});
};
