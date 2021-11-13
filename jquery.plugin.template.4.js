; ( function ( window, document, $, undefined ) {

    'use strict';

    /**
     * Plugin NAMESPACE and SELECTOR
     * @type {String}
     * @api private
     */
    var NAMESPACE = 'walkthrough',
        SELECTOR = '[data-' + NAMESPACE + ']';

    /**
     * Plugin constructor
     * @param {Node} element
     * @param {Object} [options]
     * @api public
     */
    function Plugin ( element, options ) {
        this.options = $.extend( true, $.fn[ NAMESPACE ].defaults, options );
        this.$element = $( element );

        this.originalText = this.$element.text();
    }

    /**
     * Plugin prototype
     * @type {Object}
     * @api public
     */
    Plugin.prototype = {
        constructor: Plugin,
        version: '1.0.0',
        /**
         * Init method
         * @api public
         */
        init: function () {
            // @todo add method logic
            this.$element.html( this.options.text );
        },
        restore: function () {
            this.$element.html( this.originalText );
        }

        // @todo add methods
    };

    /**
     * jQuery plugin definition
     * @param  {String} [method]
     * @param  {Object} [options]
     * @return {Object}
     * @api public
     */
    $.fn[ NAMESPACE ] = function ( method, options ) {
        return this.each( function () {
            var $this = $( this ),
                data = $this.data( 'fn.' + NAMESPACE );

            options = ( typeof method === 'object' ) ? method : options;

            if ( !data ) {
                $this.data( 'fn.' + NAMESPACE, ( data = new Plugin( this, options ) ) );
            }
            data[ ( typeof method === 'string' ) ? method : 'init' ]();
        } );
    };

    /**
     * jQuery plugin defaults
     * @type {Object}
     * @api public
     */
    $.fn[ NAMESPACE ].defaults = {
        text: 'Walkthrough'
        // @todo add defaults
    };

    /**
     * jQuery plugin data api
     * @api public
     */
    $( document ).on( 'click.' + NAMESPACE, SELECTOR, function ( event ) {
        $( this )[ NAMESPACE ]();
        event.preventDefault();
    } );

}( this, this.document, this.jQuery ) );
