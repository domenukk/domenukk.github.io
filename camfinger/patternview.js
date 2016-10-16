var initialState = "#pattern";
var currentState = initialState;

var path = "";

var userId = "";

var currentInteval = undefined;

function setUserId(newUserId) {
    userId = newUserId;
    clearInterval(currentInteval);
    currentInteval = setInterval(checkForImage, 3333);
    checkForImage();
}

function onBack() {
    if (currentState == initialState) {
        native("exit");
    }
    back();
}

var pattern = {};
var imageUrl = "";


function back() {
    location.hash = initialState;
    switch(currentState) {
        case initialState:
            console.log("What we're gonna do now? Keep rolling... Should we end the app?");
            break;
        
        default:
            $(currentState).replaceFadeRight($(initialState));
            break;
    
    }
    currentState = initialState;
}

function navigate(newId) {
    if (newId == currentState) {
        console.log("Already at " + newId);
        return;
    }
    location.hash = newId;
    $(currentState).replaceFadeLeft(newId);
    currentState = newId;
}

// initial navigation, if needed.
if (location.hash) {
    var pathId = 0;
    hashpath = location.hash.split("/");
    if (hashpath[0] == "") {
        pathId++;
    }
    
    path = hashpath[pathId];
    if (hashpath[pathId + 1]) {
        userId = hashpath[pathId + 1];
    }
    navigate(location.hash);
}

function setImageUrl(url) {
    imageUrl = url;
    console.log("received pattern image Url: " + imageUrl);
    var $pattern = $("#pattern");
    $pattern.css("pointer-events", "auto");
    var $patternLarge = $pattern.find("#patternLarge");
    $patternLarge.attr("href", url);
    $patternLarge.removeAttr("style");
    $patternLarge.find("#patternPreview").attr("src", url);
    $("#waitingText").hide();
    $("#afterWaiting").show();
    return "success"
}

function setMessage(content, intermediateProgress) {
    $("#waitinText").html(content);
    if (intermediateProgress && intermediateProgress != "false") {
        $('.mdl-js-progress').show()
        $('.mdl-js-progress').addClass("mdl-progress__indeterminate");
    } else {
        $('.mdl-js-progress').hide()
    }
}

function setPhotoCount(numDone, numTotal) {
    if (parseInt(numDone, 10) >= parseInt(numTotal, 10)) {
        $("#waitingText").html("All uploads done. Waiting for server to process. This will take a few more minutes, depending on the server load.");
        $('.mdl-js-progress').hide();
    } else {
        $("#numdone").html(numDone);
        document.querySelector('.mdl-js-progress').MaterialProgress.setProgress((numDone / numTotal) * 100);
    }
}

function showInfo() {
    navigate("#info");
}

function initMenuInterceptorToggler() {
    var animating = false;
    var $touchInterceptor = $("#menu-touch-interceptor");
    var $options = $("optionsmenu");
    function animationComplete() {
        animating = false;
    }
    function toggle() {
        if (animating) {return;}
        animating = true;
            window.setTimeout(function () {
            if (window.android) {
            $touchInterceptor.toggle();
            animationComplete();
            } else {
            $touchInterceptor.fadeToggle(animationComplete);
            }
        }, 0);
   }
    var $menutoggler = $(".menutoggler");
    $menutoggler.hammer().on("tap", toggle);
    
    $touchInterceptor.hammer().on("tap", function() {
                                             $($options).fadeOut();
                                             });
    
    // TODO: By clicking on the dots, you can reach a wrong state here...
}


var initPhotoSwipeFromDOM = function (gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function (el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if (figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if (figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if (!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if (index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
            params = {};

        if (hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function (index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            }

        };

        // PhotoSwipe opened from URL
        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
            return;
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
};


$(document).ready(function() {


initMenuInterceptorToggler();
    initPhotoSwipeFromDOM('.my-gallery');

$(document).hammer().on("swiperight", back);
$("[hammer]").on("tap", function() {
    eval($(this).attr("hammer"));
});

    if (window.android) {
        // f******ck css and beauty too.
        $(".mdl-layout__header-row").css("height", "40px");
        var $pswp = $(".pswp__top-bar");

        $pswp.css("margin-top", "25px");
        $pswp.css("padding-top", "0px");

        $(".padmemore").css("top", "40px");

        $(".mdl-layout__header").css("padding", "20px");
    }

});
