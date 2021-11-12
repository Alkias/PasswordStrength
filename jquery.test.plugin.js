( function ( factory ) {
    if ( typeof define === "function" && define.amd ) {
        define( [ "jquery" ], factory );
    } else if ( typeof module === "object" && module.exports ) {
        module.exports = factory( require( "jquery" ) );
    } else {
        factory( jQuery );
    }
}( function ( $ ) {
    $.extend( $.fn, {

        mitsos: function ( options ) {

            // If nothing is selected, return nothing; can't chain anyway
            if ( !this.length ) {
                if ( options && options.debug && window.console ) {
                    console.warn( "Nothing selected, can't call mitsos, returning nothing." );
                }
                return;
            }

            // Check if a mitsaras for this element was already created
            var mitsaras = $.data( this[ 0 ], "mitsaras" );
            if ( mitsaras ) {
                return mitsaras;
            }

            mitsaras = new $.mitsaras( options, this[ 0 ] );
            $.data( this[ 0 ], "mitsaras", mitsaras );

            if ( mitsaras.settings.onclick ) {
                this.on( "click.mitsos", ":click", function ( event ) {

                    // Allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
                    if ( $( this ).attr( "formnovalidate" ) !== undefined ) {
                        mitsaras.cancelSubmit = true;
                    }
                } );

                // Validate the form on submit
                this.on( "click.mitsos", function ( event ) {
                    if ( mitsaras.settings.debug ) {

                        // Prevent action to be able to see console output
                        event.preventDefault();
                    }

                } );

            }

            return mitsaras;
        },

        rules: function ( command, argument ) {
            var element = this[ 0 ],
                settings, staticRules, existingRules, data, param, filtered;

            // If nothing is selected, return empty object; can't chain anyway
            if ( element == null ) {
                return;
            }

            if ( command ){
                settings = $.data( element, "mitsaras" ).settings;
                staticRules = settings.rules;
                existingRules = $.mitsaras.staticRules( element );

                switch ( command ){
                    case "add":
                        $.extend( existingRules, $.mitsaras.normalizeRule( argument ) );
                        // Remove messages from rules, but allow them to be set separately
                        delete existingRules.messages;
                        staticRules[ element.name ] = existingRules;
                        if ( argument.messages ) {
                            settings.messages[ element.name ] = $.extend( settings.messages[ element.name ], argument.messages );
                        }
                        break;
                    case "remove":
                        if ( !argument ) {
                            delete staticRules[ element.name ];
                            return existingRules;
                        }
                        filtered = {};
                        $.each( argument.split( /\s/ ), function ( index, method ) {
                            filtered[ method ] = existingRules[ method ];
                            delete existingRules[ method ];
                        } );
                        return filtered;
                }
            }
        }
    } );

    // JQuery trim is deprecated, provide a trim method based on String.prototype.trim
    var trim = function ( str ) {

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim#Polyfill
        return str.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "" );
    };

    // Constructor for mitsaras
    $.mitsaras = function ( options, element ) {
        this.settings = $.extend( true, {}, $.mitsaras.defaults, options );
        this.currentElement = $(element);
        this.init();
    };
    
    // https://jqueryvalidation.org/jQuery.mitsaras.format/
    $.mitsaras.format = function ( source, params ) {
        if ( arguments.length === 1 ) {
            return function () {
                var args = $.makeArray( arguments );
                args.unshift( source );
                return $.mitsaras.format.apply( this, args );
            };
        }
        if ( params === undefined ) {
            return source;
        }
        if ( arguments.length > 2 && params.constructor !== Array ) {
            params = $.makeArray( arguments ).slice( 1 );
        }
        if ( params.constructor !== Array ) {
            params = [ params ];
        }
        $.each( params, function ( i, n ) {
            source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function () {
                return n;
            } );
        } );
        return source;
    };

    $.extend( $.mitsaras,{
        defaults:{
            messages: {},
            rules: {},
            onclick: function ( element ) {

               /*  // Click on selects, radiobuttons and checkboxes
                if ( element.name in this.submitted ) {
                    this.element( element );

                    // Or option elements, check parent select in that case
                } else if ( element.parentNode.name in this.submitted ) {
                    this.element( element.parentNode );
                } */
            }
        },

        setDefaults: function ( settings ) {
            $.extend( $.mitsaras.defaults, settings );
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            equalTo: "Please enter the same value again.",
            maxlength: $.mitsaras.format( "Please enter no more than {0} characters." ),
            minlength: $.mitsaras.format( "Please enter at least {0} characters." ),
            rangelength: $.mitsaras.format( "Please enter a value between {0} and {1} characters long." ),
            range: $.mitsaras.format( "Please enter a value between {0} and {1}." ),
            max: $.mitsaras.format( "Please enter a value less than or equal to {0}." ),
            min: $.mitsaras.format( "Please enter a value greater than or equal to {0}." ),
            step: $.mitsaras.format( "Please enter a multiple of {0}." )
        },

        prototype:{
            init:function(){
                var rules;
                rules = this.settings.rules;

                $.each( rules, function ( key, value ){
                    rules[ key ] = $.mitsaras.normalizeRule( value );
                });

                function delegate ( event ){
                    
                   /*  var mitsaras = $.data( this.element, "mitsaras" ),
                        eventType = "on" + event.type.replace( /^mitsos/, "" ),
                        settings = mitsaras.settings; */

                    var mitsaras = eventType = "on" + event.type.replace( /^mitsos/, "" ),
                        settings = mitsaras.settings;

                   /*  if ( settings[ eventType ] && !$( this ).is( settings.ignore ) ) {
                        settings[ eventType ].call( mitsaras, this, event );
                    } */
                    if ( settings[ eventType ] ) {
                        settings[ eventType ].call( mitsaras, this, event );
                    }
                }
                $( this.currentElement )
                    .on( "click.mitsos", delegate );
            },
            check: function ( element){
                element = this.validationTargetFor( this.clean( element ) );
                var rules = $( element ).rules(),
                    rulesCount = $.map( rules, function ( n, i ) {
                        return i;
                    } ).length,
                    //val = this.elementValue( element ),
                    val = this.elementValue( element ),
                    result, method, rule, normalizer;
                
                // Prioritize the local normalizer defined for this element over the global one
                // if the former exists, otherwise user the global one in case it exists.
                if ( typeof rules.normalizer === "function" ) {
                    normalizer = rules.normalizer;
                } else if ( typeof this.settings.normalizer === "function" ) {
                    normalizer = this.settings.normalizer;
                }

                // If normalizer is defined, then call it to retreive the changed value instead
                // of using the real one.
                // Note that `this` in the normalizer is `element`.
                if ( normalizer ) {
                    val = normalizer.call( element, val );

                    // Delete the normalizer from rules to avoid treating it as a pre-defined method.
                    delete rules.normalizer;
                }

                for ( method in rules ){
                    rule = { method: method, parameters: rules[ method ] };
                    try{

                    } catch ( e ){
                        if ( this.settings.debug && window.console ) {
                            console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
                        }
                        if ( e instanceof TypeError ) {
                            e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.";
                        }

                        throw e;
                    }
                }

            },
            clean: function ( selector ) {
                return $( selector )[ 0 ];
            },
            elementValue: function ( element ){
                var $element = $( element ),
                    type = element.type,
                    val, idx;
                val = $element.text();
                return val;
            },
            validationTargetFor: function ( element ) {               

                // Always apply ignore filter
                return $( element );
            },
        },
        // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
        normalizeRule: function ( data ) {
            if ( typeof data === "string" ) {
                var transformed = {};
                $.each( data.split( /\s/ ), function () {
                    transformed[ this ] = true;
                } );
                data = transformed;
            }
            return data;
        },
        addMethod: function ( name, method, message ) {
            $.mitsaras.methods[ name ] = method;
            $.mitsaras.messages[ name ] = message !== undefined ? message : $.mitsaras.messages[ name ];
            
        },

        methods:{
            required: function ( value, element, param ) {

                if ( element.nodeName.toLowerCase() === "select" ) {

                    // Could be an array for select-multiple or a string, both are fine this way
                    var val = $( element ).val();
                    //return val && val.length > 0;
                    return alert(val);
                }
                if ( this.checkable( element ) ) {
                    return this.getLength( value, element ) > 0;
                }
                return value !== undefined && value !== null && value.length > 0;
            },
        }
    });

} ) );
