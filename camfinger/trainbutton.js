/**
 * Created by domenukk on 26.04.16.
 */

var texts = [
    "Thank you!",
    "<strong>1</strong>x4 almost! :)",
    "<strong>2</strong>x4 - go on...", //<img src='./assets/chemoji.png'>",
    "<strong>3</strong> more - for science!",
    "<strong>4</strong>x4 (in words: four)",
];

var photosToGo = texts.length;

function setCaptureCount(captureCount) {
    photosToGo = captureCount;
    if (photosToGo >= 0) {
        $("#text").html(texts[photosToGo]);
    } /*else {
        native("doneLearning");
    }*/
}

function setMessage(content) {
   $("#text").html(content);
   photosToGo = 1; // show thank you afterwards
}

function buttonPressed() {
    native("capture");
    photosToGo--;
    setCaptureCount(photosToGo);
}