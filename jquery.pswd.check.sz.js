( function ( $ ) {
  $.fn.pswdCheck = function ( userConfig ) {
    // Ensure config is an object
    if ( !userConfig ) {
      userConfig = {};
    }

    // Maintain a reference to the element
    var elem = this;
    var strengthResult = 0;

    var runTest = function ( test ) {
      // Run the test's callback, passing the current value of
      // the element and another callback to be run when the
      // test is complete
      var result = test.cb( elem.val() );
      config.testCb( test, result );
      return result;
    };

    // Callback run for before tests are run
    var resetCallback = function ( ev ) {
      $( "#strength-bar" ).css( { width: "0%" } );
      $( "#progress-bar-index" ).text( "0%" );
      $( "#progress-bar-messges" ).text( "" );
    };

    // Callback to passed the output of the testCb
    var completeCallback = function () { };

    // Callback run for each test, allowing the way the results
    // are outputted to be customised by the user
    var testCallback = function ( rule, result ) {
      strengthResult += result;

      console.log( rule.name + ": " + result );
      console.log( "Total Strenth" + ": " + strengthResult );

      var totalProgress = strengthResult >= config.targetStrength
        ? 100
        : ( strengthResult * 100 ) / config.targetStrength;
      //console.log("totalProgress: " + totalProgress);

      //totalProgress = Math.round((totalProgress + Number.EPSILON) * 100) / 100;
      totalProgress = totalProgress.toFixed( 0 );
      //console.log("totalProgressFixed: " + totalProgress);

      /* $("#strength-bar").css({ width: totalProgress + "%" });
      $("#progress-bar-index").text(totalProgress + "%"); */

      $( "#progress-bar-messges" ).text( messages( strengthResult ) );
      $( "#progress-bar-messges" ).css( { "background-color": "red" } );
    };

    function messages ( val ) {
      var m = "";
      if ( val <= 24 ) m = "Very Weak";
      if ( val >= 25 && val <= 49 ) m = "Weak";
      if ( val >= 50 && val <= 59 ) m = "Good";
      if ( val >= 60 && val <= 69 ) m = "Strong";
      if ( val >= 70 && val <= 79 ) m = "Very Strong";
      if ( val >= 80 && val <= 89 ) m = "Secure";
      if ( val >= 90 ) m = "Very Secure";
      return m;
    }

    // Default plugin configuration
    // outside the userConfig
    var config = {
      trigger: "keyup",
      resetCb: resetCallback,
      testCb: testCallback,
      completeCb: completeCallback,
      tests: [],
      targetStrength: 78
    };

    // Merge the defaults with the user supplied config
    $.extend( true, config, userConfig );

    defaultMessage = function ( rule ) {

    }

    // Get to work
    $( "body" ).on( config.trigger, elem, function ( ev ) {

      // Avoid revalidate the field when pressing one of the following keys
      // Shift       => 16
      // Ctrl        => 17
      // Alt         => 18
      // Caps lock   => 20
      // End         => 35
      // Home        => 36
      // Left arrow  => 37
      // Up arrow    => 38
      // Right arrow => 39
      // Down arrow  => 40
      // Insert      => 45
      // Num lock    => 144
      // AltGr key   => 225
      var excludedKeys = [
        16, 17, 18, 20, 35, 36, 37,
        38, 39, 40, 45, 144, 225
      ];
      console.log( ev.which );

      if ( ev.which === 9 && this.elementValue( elem ) === "" || $.inArray( ev.keyCode, excludedKeys ) !== -1 )
        return;

      // Fire the reset callback
      config.resetCb( ev );

      console.clear();

      // Test against default/supplied rules
      var i = 0,
        l = config.tests.length;
      for ( ; i < l; i++ ) {
        // Run it...
        config.completeCb( runTest( config.tests[ i ] ) );
      }

      strengthResult = 0;
    } );
  };
} )( jQuery );
