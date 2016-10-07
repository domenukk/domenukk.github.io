//var element = document.querySelector("#greeting");
//element.innerText = "Hello, world!";

var SPEED = 550;
var DROID_CHANGING_TIME = 150;

function native(what) {
    console.log("native ignored: " + what);
}

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

    

}

$(document).ready(function () {
    var $bottom = $("#bottom");
    $bottom.hide();
    setTimeout(function () {
        $bottom.fadeIn(750);
    }, 4000);

    $("#ios").click(function () {
        top.location.href = "https://itunes.apple.com/us/app/camfinger/id1159564814?l=de&ls=1&mt=8";
    });

    $("#android").click(function () {
        top.location.href = 'https://play.google.com/store/apps/details?id=de.fau.camfinger&utm_source=global_co&utm_medium=prtnr&utm_content=Mar2515&utm_campaign=PartBadge&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1';
    });


    var $section = $(".section");

    //colors = ['#13D609', '#387ABD', '#FFB13D', '#FF7E3D'];
    var colors = ['#1bbc9b', '#7BAABE', '#FFB13D', '#ccc', '#fff']; //TODO!
    $('#fullpage').fullpage({
        //Navigation
        menu: '#menu',
        lockAnchors: true,
        anchors: ['firstPage', 'secondPage'],
        navigation: false, //true,
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
        scrollOverflow: true,

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
        //onLeave: function(index, nextIndex, direction){},
        afterLoad: function (anchorLink, index) {
            $("#loading").addClass("hidden"); // CSS3 animation because jQuery Animation is too slow together with fullpages.js entry animation
            $fixeds.hide();
            $($fixeds[index]).show();
            console.log("loaded ", anchorLink, index);
            
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
            onNavigateCallback(nextSlideIndex);

            $section.animate({
                backgroundColor: colors[nextSlideIndex]
            });

            if (nextSlideIndex == 5) {
                hideMe();
            }
        }
    });


});