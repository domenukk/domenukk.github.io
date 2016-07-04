function isIOS() {
    return !/safari/.test(window.navigator.userAgent.toLowerCase()) || navigator.platform === 'iOS' || navigator.platform === 'iPhone';
}

function native(action) {
    if (isIOS()) {
        window.location.replace("inapp://" + action);
    } else if (window.android) {
        console.log("Handling action: " + action);
        window.android[action]();
    } else {
        alert("Handle this action nau: " + action);
    }
}


var defaultFadeTime = 0;

var seconds = 0.32;
$.fn.extend({
    isAnimating: false,
    // see https://github.com/daneden/animate.css
    animateCss: function (animationName, callback) {

        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        var $this = $(this);
        $this.css("-vendor-animation-duration", seconds +"s");

        if ($this.isAnimating) {
            console.log("ignoring naviagtion, currently animating", $this);
            throw("already moving exception");
        }
        $this.isAnimating = true;
        $this.addClass('animated ' + animationName).one(animationEnd, function () {
          $this.removeClass('animated ' + animationName);
            this.isAnimating = false; 
            if (callback) {
                callback($this);
            }
        });
    },
    fadeOutLeft: function (callback) {
        $(this).animateCss("fadeOutLeft", function ($el) {
            $el.hide();
            if (callback) {
                callback($el);
            }
        });
    },

    fadeOutRight: function (callback) {
        $(this).animateCss("fadeOutRight", function ($el) {
            $el.hide();
            if (callback) {
                callback($el);
            }
        });
    },

    fadeInRight: function (callback) {
        var $this = $(this);
        $this.show();
        $this.animateCss("fadeInRight", callback);
    },
    
    fadeInLeft: function (callback) {
        var $this = $(this);
        $this.show();
        $this.animateCss("fadeInLeft", callback);
    },
    replaceFadeLeft: function ($new, callback) {
        if (typeof $new == "string") {
            $new = $($new);
        }
        if ($new.isAnimating || $(this).isAnimating) {
            throw("AlreadyAnimating");
        }
        $(this).fadeOutLeft();
        window.setTimeout(function () {
            if (window.android) {
                $new.show();
                callback();
            } else {
                $new.fadeInRight(callback);
            }
            
        }, defaultFadeTime);
    },
    replaceFadeRight: function ($new, callback) {
        if (typeof $new == "string") {
            $new = $($new);
        }
         if ($new.isAnimating || $(this).isAnimating) {
            throw("AlreadyAnimating");
        }
        $(this).fadeOutRight();
        window.setTimeout(function () {
            if (window.android) {
                $new.show();
                callback();
            } else {
                $new.fadeInLeft(callback);
            }
        }, defaultFadeTime);
    }
    
});
