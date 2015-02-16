$( document ).on( 'ready', function ( e ) {

	console.log( 'ready window' );

	/**
	 * Characters mapping
	 */
	var keymap = [{"id":8,"name":"Backspace"},{"id":9,"name":"Tab"},{"id":13,"name":"Enter"},{"id":16,"name":"Shift"},{"id":17,"name":"Ctrl"},{"id":18,"name":"Alt"},{"id":19,"name":"Pause/Break"},{"id":20,"name":"Caps Lock"},{"id":27,"name":"Esc"},{"id":33,"name":"Page Up"},{"id":34,"name":"Page Down"},{"id":35,"name":"End"},{"id":36,"name":"Home"},{"id":37,"name":"←"},{"id":38,"name":"↑"},{"id":39,"name":"→"},{"id":40,"name":"↓"},{"id":45,"name":"Insert"},{"id":46,"name":"Delete"},{"id":48,"name":"0"},{"id":49,"name":"1"},{"id":50,"name":"2"},{"id":51,"name":"3"},{"id":52,"name":"4"},{"id":53,"name":"5"},{"id":54,"name":"6"},{"id":55,"name":"7"},{"id":56,"name":"8"},{"id":57,"name":"9"},{"id":65,"name":"A"},{"id":66,"name":"B"},{"id":67,"name":"C"},{"id":68,"name":"D"},{"id":69,"name":"E"},{"id":70,"name":"F"},{"id":71,"name":"G"},{"id":72,"name":"H"},{"id":73,"name":"I"},{"id":74,"name":"J"},{"id":75,"name":"K"},{"id":76,"name":"L"},{"id":77,"name":"M"},{"id":78,"name":"N"},{"id":79,"name":"O"},{"id":80,"name":"P"},{"id":81,"name":"Q"},{"id":82,"name":"R"},{"id":83,"name":"S"},{"id":84,"name":"T"},{"id":85,"name":"U"},{"id":86,"name":"V"},{"id":87,"name":"W"},{"id":88,"name":"X"},{"id":89,"name":"Y"},{"id":90,"name":"Z"},{"id":91,"name":"Left WinKey"},{"id":92,"name":"Right WinKey"},{"id":93,"name":"Select"},{"id":96,"name":"NumPad 0"},{"id":97,"name":"NumPad 1"},{"id":98,"name":"NumPad 2"},{"id":99,"name":"NumPad 3"},{"id":100,"name":"NumPad 4"},{"id":101,"name":"NumPad 5"},{"id":102,"name":"NumPad 6"},{"id":103,"name":"NumPad 7"},{"id":104,"name":"NumPad 8"},{"id":105,"name":"NumPad 9"},{"id":106,"name":"NumPad *"},{"id":107,"name":"NumPad +"},{"id":109,"name":"NumPad -"},{"id":110,"name":"NumPad ."},{"id":111,"name":"NumPad /"},{"id":112,"name":"F1"},{"id":113,"name":"F2"},{"id":114,"name":"F3"},{"id":115,"name":"F4"},{"id":116,"name":"F5"},{"id":117,"name":"F6"},{"id":118,"name":"F7"},{"id":119,"name":"F8"},{"id":120,"name":"F9"},{"id":121,"name":"F10"},{"id":122,"name":"F11"},{"id":123,"name":"F12"},{"id":144,"name":"Num Lock"},{"id":145,"name":"Scroll Lock"},{"id":186,"name":";"},{"id":187,"name":"="},{"id":188,"name":","},{"id":189,"name":"-"},{"id":190,"name":"."},{"id":191,"name":"/"},{"id":192,"name":"`"},{"id":219,"name":"["},{"id":220,"name":"\\"},{"id":221,"name":"]"},{"id":222,"name":"'"}];

	var km = function ( id ) {
		for( var i = 0; i < keymap.length; i++ ) {
			if ( keymap[ i ].id === id ) return keymap[ i ].name;
		}
		if ( String.fromCharCode( id ) ) return String.fromCharCode( id );
		return false;
	};

	var strToBool = function ( string ) {
		return string === 'true';
	};

	$( '#hotkey' ).on( 'keydown', function ( e ) {
		e.preventDefault( );
		$this = $( this );


		/**
		 * Ensure there is at least one modifier
		 */
		var modCount = 0;
		if ( e.altKey ) modCount++;
		if ( e.ctrlKey ) modCount++;
		if ( e.shiftKey ) modCount++;
		if ( modCount < 1 ) return;


		/**
		 * Get the Key
		 */
		var key = km( e.which );


		/**
		 * Put combination to input
		 */
		var kc = '';
		if ( e.ctrlKey ) kc += 'Ctrl + ';
		if ( e.altKey ) kc += 'Alt + ';
		if ( e.shiftKey ) kc += 'Shift + ';
		kc += key;
		$this.val( kc );


		/**
		 * Reset input value if no Key but only modifier was pressed
		 */
		if ( e.which === 16 || e.which === 17 || e.which === 18 ) {
			kc = '';
			if ( strToBool( $this.attr( 'data-ctrl' ) ) ) kc += 'Ctrl + ';
			if ( strToBool( $this.attr( 'data-alt' ) ) ) kc += 'Alt + ';
			if ( strToBool( $this.attr( 'data-shift' ) ) ) kc += 'Shift + ';
			kc += km( +$this.attr( 'data-key' ) );
			return $this.val( kc );
		}


		/**
		 * Put combination to HTML element on the page, for latter using ( e.g. for Save settings )
		 */
		// First of all reset the combination
		$this.attr( 'data-ctrl', false );
		$this.attr( 'data-alt', false );
		$this.attr( 'data-shift', false );
		$this.attr( 'data-key', false );

		// Then fill with current value
		if ( e.ctrlKey ) $this.attr( 'data-ctrl', true );
		if ( e.altKey ) $this.attr( 'data-alt', true );
		if ( e.shiftKey ) $this.attr( 'data-shift', true );
		$this.attr( 'data-key', e.which );
	});


	/**
	 * Get settings from storage and put to input
	 */
	chrome.storage.sync.get({
		ctrl: true,
		alt: true,
		shift: false,
		key: 90 // 90 === Z ( default combination Ctrl + Alt + Z )
	}, function ( items ) {
		console.log( 'chrome.storage.sync.get', items );
		$( '#hotkey' ).attr( 'data-ctrl', items.ctrl );
		$( '#hotkey' ).attr( 'data-alt', items.alt );
		$( '#hotkey' ).attr( 'data-shift', items.shift );
		$( '#hotkey' ).attr( 'data-key', items.key );

		var kc = '';
		if ( items.ctrl ) kc += 'Ctrl + ';
		if ( items.alt ) kc += 'Alt + ';
		if ( items.shift ) kc += 'Shift + ';
		kc += km( items.key );
		return $( '#hotkey' ).val( kc );
	});

	$( '#save' ).on( 'click', function ( e ) {
		chrome.storage.sync.set({
			ctrl: strToBool( $( '#hotkey' ).attr( 'data-ctrl' ) ), // Cast to Boolean
			alt: strToBool( $( '#hotkey' ).attr( 'data-alt' ) ), // Cast to Boolean
			shift: strToBool( $( '#hotkey' ).attr( 'data-shift' ) ), // Cast to Boolean
			key: +$( '#hotkey' ).attr( 'data-key' ) // Cast to Number
		}, function ( err ) {
			$( '#saved' ).show( 'normal' );
			setTimeout( function ( ) {
				$( '#saved' ).hide( 'normal' );
			}, 1450 );
			console.log( 'Saved' );
		});
	});



	/**
	 * Additional JS-includes
	 */
	/*Meow*/
				if (!String.prototype.trim) {
					(function() {
						// Make sure we trim BOM and NBSP
						var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
						String.prototype.trim = function() {
							return this.replace(rtrim, '');
						};
					})();
				}

				[].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
					// in case the input is already filled..
					if( inputEl.value.trim() !== '' ) {
						classie.add( inputEl.parentNode, 'input--filled' );
					}

					// events:
					inputEl.addEventListener( 'focus', onInputFocus );
					inputEl.addEventListener( 'blur', onInputBlur );
				} );

				function onInputFocus( ev ) {
					classie.add( ev.target.parentNode, 'input--filled' );
				}

				function onInputBlur( ev ) {
					if( ev.target.value.trim() === '' ) {
						classie.remove( ev.target.parentNode, 'input--filled' );
					}
				}






			var buttons7Click = Array.prototype.slice.call( document.querySelectorAll( '#btn-click button' ) ),
				totalButtons7Click = buttons7Click.length;

			buttons7Click.forEach( function( el, i ) { el.addEventListener( 'click', activate, false ); } );

			function activate() {
				var self = this, activatedClass = 'btn-activated';

				if( classie.has( this, 'btn-7h' ) ) {
					// if it is the first of the two btn-7h then activatedClass = 'btn-error';
					// if it is the second then activatedClass = 'btn-success'
					activatedClass = buttons7Click.indexOf( this ) === totalButtons7Click-2 ? 'btn-error' : 'btn-success';
				}

				if( !classie.has( this, activatedClass ) ) {
					classie.add( this, activatedClass );
					setTimeout( function() { classie.remove( self, activatedClass ) }, 1000 );
				}
			}
});
