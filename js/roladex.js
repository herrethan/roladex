// Roladex Plugin
// version 1.0
// 6/10/14
// copyright(c) 2012-2014 Ethan Herr
// http://herrmedia.com
// MIT License

var roladex = {
  init: function( options, element ) {

    // merge options
    this.options = $.extend({}, this.options, options );

    // define element
    this.$el = $(element);

    // define index number initially displayed on card
    this.i = this.options.startvalue;

    // build initial structure
    this._init();

    return this;
  },
  // defaults
  options: {
    startvalue : 1,
    minvalue : 0,
    maxvalue : 10
  },
  _init: function(){
    var cards = "";
    // create one card below, two cards above
    for( i = -1; i <= 2; i++) cards += this.construct( this.i + i );
    
    this.$el.html( cards );

    // create visual "split" display of card
    // note: moz has trouble with 3D flip when z-indexes are too close together
    this.$el.find('.card').eq(1).css({ 'z-index' : 99 });
    this.$el.find('.card').eq(2).css({ 'z-index' : 49 }).addClass('turn');
    this.$el.find('.card').eq(3).addClass('turn');
  },
  zero: function( number ){ // add 0 to single digits
    if( number < 10 ) number = '0' + number;
    return number;
  },
  construct: function( value, newclass ){ // new HTML needs to be created each flip, sorry!
    if( value > this.options.maxvalue ) { value = value - this.options.maxvalue - 1 }
    else if( value < this.options.minvalue ) { value = value + this.options.maxvalue + 1 };
    var value2 = ( value - 1 ) < this.options.minvalue ? this.options.maxvalue : ( value - 1 );
    newclass = newclass || "";
    return '<div class="card' + newclass + '">' +
              '<div class="face front"><span>' + this.zero(value) + '</span></div>' +
              '<div class="face back"><span>' + this.zero(value2) + '</span></div>' +
            '</div>';
  },
  flipup: function( call ){ // increment card value
    this.$el.find('.card').eq(2).css({ 'z-index' : 99 });
    this.$el.find('.card').eq(3).css({ 'z-index' : 49 });
    this.$el.find('.card').eq(1).css({ 'z-index' : 0 });
    this.$el.find('.card').eq(2).removeClass('turn');
    this.i = this.i == this.options.maxvalue ? this.options.minvalue : this.i + 1;
    this.$el.append( this.construct( this.i + 2, " turn"));
    this.$el.find('.card:first-child').remove();
    if( call ) call( this.i );
  },
  flipdown: function( call ){ // decrement value
    this.$el.find('.card').eq(1).css({ 'z-index' : 49 });
    this.$el.find('.card').eq(2).css({ 'z-index' : 0 });
    this.$el.find('.card').eq(0).css({ 'z-index' : 99 });
    this.$el.find('.card').eq(1).addClass('turn');
    this.i = this.i == this.options.minvalue ? this.options.maxvalue : this.i - 1;
    this.$el.prepend( this.construct( this.i - 1 ), "");
    this.$el.find('.card:last-child').remove();
    if( call ) call( this.i );
  }
};


// Object.create support test, and fallback for browsers without it
// if ( typeof Object.create !== 'function' ) {
//     Object.create = function (o) {
//         function F() {}
//         F.prototype = o;
//         return new F();
//     };
// }

// register plugin
$.plugin = function( name, object ){
  $.fn[name] = function( options ){
    return this.each(function(){
      if( !$.data( this, name ) ){
        $.data( this, name, Object.create(object).init( 
        options, this ) );
      }
    });
  };
};

$.plugin('roladex', roladex);