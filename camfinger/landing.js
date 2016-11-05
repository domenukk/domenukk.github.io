function navigateToAppStore() {
    top.location.href = "https://itunes.apple.com/us/app/camfinger/id1159564814?l=de&ls=1&mt=8";
}

function navigateToPlayStore() {
    top.location.href = 'https://play.google.com/store/apps/details?id=de.fau.camfinger';
}

$(document).ready(function () {
    "use strict";
    var colors = ['#1bbc9b', '#7BAABE', '#FFB13D', '#ccc', '#fff'];
    var SPEED = 550;

    var $fixeds = $(".fixed");
    var $bottom = $("#bottom");
    var $section = $(".section");
    var $fullpage = $('#fullpage');
    var $root = $('#root');
    var $loading = $('#loading');
    // the buttons
    var $ios = $("#ios");
    var $android = $("#android");

    $bottom.hide();

    function showFixedAt(index) {
        $fixeds.hide();
        $($fixeds[index]).show();
    }

    showFixedAt(0);

    $root.fadeIn(2000);

    // fade in the app stores after 10 seconds.
    setTimeout(function () {
        $bottom.fadeIn(750);
    }, 10000);

    // handle appstore forwarding
    if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
        if (document.referrer) {
            // chrome on android does not allow forwarding to an app straight from user input.
            navigateToPlayStore();
        }
        $ios.hide();
    }
    if (isIOS()) {
        navigateToAppStore();
        $android.hide();
    }

    $fullpage.fullpage({
        //Navigation
        menu: '#menu',
        lockAnchors: true,
        anchors: ['intro', 'science', 'fingerprint', 'download'],
        navigation: false,
        showActiveTooltip: true,

        //Scrolling
        css3: false,
        scrollingSpeed: SPEED,
        autoScrolling: true,
        fitToSection: true,
        fitToSectionDelay: 500,
        scrollBar: true,
        easing: 'easeInOutCubic',
        easingcss3: 'ease',
        loopBottom: false,
        loopTop: false,
        normalScrollElements: '#element1, .element2',
        scrollOverflow: false,

        //Accessibility
        keyboardScrolling: true,
        animateAnchor: true,
        recordHistory: true,

        //Design
        controlArrows: true,
        verticalCentered: true,
        resize: true,
        sectionsColor: colors,
        fixedElements: '#header, .footer',
        responsiveWidth: 0,
        responsiveHeight: 0,

        //events
        onLeave: function (index, nextIndex, direction) {
            // horizontal
            setTimeout(function () {
                $fixeds.hide();
                $($fixeds[nextIndex]).show();
            }, 300);
        },

        afterLoad: function (anchorLink, index) {
            $("#loading").addClass("hidden"); // CSS3 animation because jQuery Animation is too slow together with fullpages.js entry animation
            $fixeds.hide();
            $($fixeds[index]).show();
            //console.log("loaded ", anchorLink, index);

            // hide the main foo :)
            if (index > 3) {
                $bottom.fadeIn(750);
            }
        },
        //afterRender: function(){},
        //afterResize: function(){},
        afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {
            //Animate the checkmark after slide
            $($fixeds[slideIndex]).find("#animateme").addClass("svg");
        },

        onSlideLeave: function (anchorLink, index, slideIndex, direction, nextSlideIndex) {
            $section.animate({
                backgroundColor: colors[nextSlideIndex]
            });
        }
    });

});
