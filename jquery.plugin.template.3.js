/*!
 * jQuery Plugin template 
 *
 * @author jnoodle
 */

/**
 * Let the plugin support AMD standard module loading mode
 *
 * If you don't need to support AMD, you can also use it directly:
 * (function($){ ... })(jQuery);
 *
 * Encapsulate the plugin in a closure to prevent external pollution
 */
 ;
 (function (factory) {
 
     // If you want to be compatible with other standards such as CMD, you can add conditions below, such as:
     // CMD: typeof define === 'function' && define.cmd
     // UMD: typeof exports === 'object'
     if (typeof define === 'function' && define.amd) {
         // AMD
         define(['jquery'], factory);
     } else {
         factory(jQuery);
         // If you want to be compatible with Zepto, you can rewrite it, such as using：factory(jQuery||Zepto)
     }
 }(function ($) {
     'use strict';
 
     /**
      * Define the construction method of the plugin
      * @param element Selector object
      * @param options Configuration item
      * @constructor
      */
     var Plugin = function (element, options) {
 
         //Combine parameter settings
         this.options = $.extend({}, Plugin.defaults, options);
 
         //Assign the selector object to the plugin to facilitate subsequent calls
         this.$element = $(element);
 
         //Do some initialization work
         this.init();
     };
 
     /**
      * The name of the plugin, which is the name when it is called（$.fn.pluginName）
      * @type {string}
      */
     Plugin.pluginName = "pluginName";
 
     /**
      * The name of the plugin cache, the plugin is cached in the dom structure through the data method, and the name of the stored data
      * @type {string}
      */
     Plugin.dataName = "pluginDataName";
 
     /**
      * Plugin version
      * @type {string}
      */
     Plugin.version = "1.0.0";
 
     /**
      * Plugin default configuration items
      * @type {{}}
      */
     Plugin.defaults = {
         option1: "...",
         option2: "..."
     };
 
     /**
      * How to define the plugin
      * @type {{}}
      */
     Plugin.prototype = {
 
         init: function () {
             console.log('init');
         },
 
         func1: function () {
 
         },
 
         func2: function () {
 
         }
     };
 
     /**
      * Cache plugins of the same name
      */
     var old = $.fn[Plugin.pluginName];
 
     /**
      * Define plug-ins, extend $.fn, and provide new plugin methods for jQuery objects
      * Calling method:$.fn.pluginName()
      * @param option {string/object}
      */
     $.fn[Plugin.pluginName] = function (option) {
         return this.each(function () {
             var $this = $(this);
 
             var data = $this.data(Plugin.dataName);
             var options = typeof option == 'object' && option;
 
             //Only instantiate it once, and if the plugin is called again later, the cached object will be directly obtained
             if (!data) {
                 $this.data(Plugin.dataName, (data = new Plugin(this, options)));
             }
             //If the parameter of the plugin is a string, the name of the plugin is directly called as the string method
             if (typeof option == 'string') data[option]();
         });
     };
 
     $.fn[Plugin.pluginName].Constructor = Plugin;
 
     /**
      * Add the noConflict method to the plugin to release control when the plugin has the same name
      * @returns {*}
      */
     $.fn[Plugin.pluginName].noConflict = function () {
         $.fn[Plugin.pluginName] = old;
         return this
     };
 
     /**
      * Optional:
      * By defining data-role='pluginName' on the dom, the plugin is automatically instantiated, eliminating the need to write code on the page
      * More configurations can be extended here, and plug-ins can be used only through the data attribute API
      */
     $(document).ready(function () {
         $('[data-role="' + Plugin.pluginName + '"]').each(function () {
             var $this = $(this);
             var data = $this.data();
 
             // ...
 
             $.fn[Plugin.pluginName].call($this, data);
         });
     });
 }));