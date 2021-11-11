(function ($) {
  $.fn.pswdCheck = function (userConfig) {
    // Ensure config is an object
    if (!userConfig) {
      userConfig = {};
    }

    // Maintain a reference to the element
    var elem = this;
    var strengthResult = 0;

    var runTest = function (test) {
      // Run the test's callback, passing the current value of
      // the element and another callback to be run when the
      // test is complete
      var result = test.cb(elem.val());
      config.testCb(test, result);
      return result;
    };

    // Callback run for before tests are run
    var resetCallback = function (ev) {
      $("#strength-bar").css({ width: "0%" });
      $("#progress-bar-index").text("0%");
    };

    // Callback to passed the output of the testCb
    var completeCallback = function () {};

    // Callback run for each test, allowing the way the results
    // are outputted to be customised by the user
    var testCallback = function (rule, result) {
      strengthResult += result;

      console.log(rule.name + ": " + result);
      console.log("Total Strenth" + ": " + strengthResult);

      var totalProgress = strengthResult>= config.targetStrength
                        ? 100
                        : (strengthResult * 100) / config.targetStrength;
      //console.log("totalProgress: " + totalProgress);

      //totalProgress = Math.round((totalProgress + Number.EPSILON) * 100) / 100;
      totalProgress = totalProgress.toFixed(0);
      //console.log("totalProgressFixed: " + totalProgress);

      $("#strength-bar").css({ width: totalProgress + "%" });
      $("#progress-bar-index").text(totalProgress + "%");
    };

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
    $.extend(true, config, userConfig);

    // Get to work
    $("body").on(config.trigger, elem, function (ev) {
      // Fire the reset callback
      config.resetCb(ev);

      console.clear();

      // Test against default/supplied rules
      var i = 0,
        l = config.tests.length;
      for (; i < l; i++) {
        // Run it...
        config.completeCb(runTest(config.tests[i]));
      }

      strengthResult = 0;
    });
  };
})(jQuery);
