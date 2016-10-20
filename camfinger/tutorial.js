//var element = document.querySelector("#greeting");
//element.innerText = "Hello, world!";

var SPEED = 350;
var DROID_CHANGING_TIME = 150;

function hideMe() {
    native("startLearning");
}

var $fixeds = $(".fixed");
$fixeds.hide();
$($fixeds[0]).show();

var current = 0;

function onNavigateCallback(pageIndex) {
    current = pageIndex;
    console.log("navigating to", pageIndex);

    var $current = $($fixeds[pageIndex]);
    ;

    if (window.android) {
        setTimeout(function () {
            $fixeds.hide();
            $current.show();
        }, DROID_CHANGING_TIME);

    } else {
        $fixeds.fadeOut();
        $current.fadeIn();
    }
//    $current.find(".animate").each(function (el) {
    // new Vivus(el, {duration: 1000}); //myCallback);
    //});

    //$("#topelement").html("PAGE" + pageIndex);


}

function onBack() {
    if (current == 0) {
        native("exit");
    }
    $.fn.fullpage.moveSlideLeft();
}

$(document).ready(function () {


    var $section = $(".section");

    //colors = ['#13D609', '#387ABD', '#FFB13D', '#FF7E3D'];
    var colors = ['#1bbc9b', '#7BAABE', '#ccddff', '#FFB13D', '#ccc', '#fff']; //TODO!
    $('#fullpage').fullpage({
        //Navigation
        menu: '#menu',
        lockAnchors: false,
        anchors: ['firstPage', 'secondPage'],
        navigation: false,
        showActiveTooltip: false,
        slidesNavigation: true,
        slidesNavPosition: 'bottom',

        //Scrolling
        css3: true,
        scrollingSpeed: SPEED,
        autoScrolling: true,
        fitToSection: true,
        fitToSectionDelay: 1000,
        scrollBar: false,
        easing: 'easeInOutCubic',
        easingcss3: 'ease',
        loopBottom: false,
        loopTop: false,
        loopHorizontal: false,
        continuousVertical: false,
        normalScrollElements: '#element1, .element2',
        scrollOverflow: false,
        touchSensitivity: 2, // percent of movement in browser needed to scroll
        normalScrollElementTouchThreshold: 5,

        //Accessibility
        keyboardScrolling: true,
        animateAnchor: true,
        recordHistory: true,

        //Design
        controlArrows: true,
        verticalCentered: true,
        resize: false,
        sectionsColor: colors,
        paddingTop: '30%',
        fixedElements: '#header, .footer',
        responsiveWidth: 0,
        responsiveHeight: 0,

        //events
        //onLeave: function(index, nextIndex, direction){},
        afterLoad: function (anchorLink, index) {
            // hide the main foo :)
            $("#loading").addClass("hidden"); // CSS3 animation because jQuery Animation is too slow together with fullpages.js entry animation

        },
        //afterRender: function(){},
        //afterResize: function(){},
        afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {
            //Animate the checkmark after slide
            $($fixeds[slideIndex]).find("#animateme").addClass("svg");


            if (slideIndex >= 2) {
                setTimeout(function () {
                    native("initCamera");
                }, 5);
            }
        },
        onSlideLeave: function (anchorLink, index, slideIndex, direction, nextSlideIndex) {
            onNavigateCallback(nextSlideIndex);


            if (window.android) {
                setTimeout(function () {
                    $section.css("backgroundColor", colors[nextSlideIndex]);
                }, DROID_CHANGING_TIME);
            } else {

                $section.animate({
                    backgroundColor: colors[nextSlideIndex],
                });
            }


            if (nextSlideIndex == 5) {
                hideMe();
            }
        }
    });


});