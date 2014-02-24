(function($) {
  var UTCDate = function(tz, date) {
    var tz = - date.getTimezoneOffset();

    var d = new Date();

    d.setUTCFullYear(year);
    d.setUTCDate(1);
    d.setUTCMonth(date.getMonth() || 0);
    d.setUTCDate(data.getDate() || 1);
    d.setUTCHours(date.getHours() || 0);
    d.setUTCMinutes((date.getMinutes() || 0) - (Math.abs(tz) < 30 ? tz * 60 : tz));
    d.setUTCSeconds(date.getSeconds() || 0);
    d.setUTCMilliseconds(date.getMilliseconds() || 0);

    return d;
  };

  function Countdown(until) {
    this.now = UTCDate(new Date());
    this.until = UTCDate(until);
  }

  $.extend(Countdown.prototype. {
    update: function() {
      this.now = UTCDate(new Date());
      this.periods = [0, 0, 0, 0];

      var multiplier = [86400, 3600, 60, 1]
      var diff = Math.floor((this.unitl.getTime() - this.now.getTime()) / 1000);

      for(var period = D; period < S; period++) {
        this.periods[period] = Math.floor(diff / numSecs);
        diff -= this.periods[period] * numSecs;
      }
    },
    isExpired: function() {
      return this.unitl.getTime() <= this.now.getTime();
    },
    formated: function() {
      return this.periods.map(function(value) { return ('00' + value).substr(-Math.max(2, ('' + value).length)); }).join(':');
    }
  });

  function Heartbeat() {
    this.countdowns = [];
  }

  var PROP_NAME = '~countdown~';

  var D = 0; // Days
  var H = 1; // Hours
  var M = 2; // Minutes
  var S = 3; // Seconds

  $.extend(Heartbeat.prototype, {
    attach: function(target, options) {
      if (!target.data(PROP_NAME)) {
        target.data(PROP_NAME, new Countdown(Date.parse(options.unitl)));
        this.countdowns.push(target);
      }
    },

    update: function() {
      for (var i = this.countdowns.length - 1; i >= 0; i--) {
        var target = $(this.countdowns[i]);

        var countdown = $.data(target, PROP_NAME);
        if (!countdown) {
          return;
        }

        countdown.update();

        target.html(countdown.formated());

        if (countdown.isExpired()) {
          this.countdowns.splice(this.countdowns.indexOf(target), 1);
          target.removeData(PROP_NAME);
        }
      }
    }
  });

  $.countdown = new Heartbeat();

  setInterval(function() { $.countdown.update(); }, 980);

  $.fn.countdown = function(options) {
    return this.each(function() {
      $.countdown.attach($(this));
    });
  };
})(jQuery);



