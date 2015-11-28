// DOMs
var $container = $('#dvName');
var $holders = $('.img-holder');
// Wait time to start/stop the spinner, 5 seconds
var waitTime = 5;
// Degree per item, used to caculate item position and find the result position
var deg = 0;
// Flag to mark app state is rolling or not
var waitting = false;
// Save last position to make the spinner looks "continously"
var lastPosition = 0;

/**
 * Place all images in position (equally devided by 360 degree)
 */ 
function setUp() {
    $holders.each(function (i) {
        var $img = $(this);
        deg = 360 / $holders.length
        $img.css('transform', 'rotateZ(' + (deg * i) + 'deg)');
    });
}

/**
 * Return random result
 * @return integer : index of element from $holders array
 */ 
function getRandomResult() {
    return (Math.floor(Math.random() * $holders.length) + 1);
}

/**
 * Start the spin, wait a bit, then stop it
 */ 
function draw() {
    // If state is rolling, return
    if (waitting) return;

    // The lucky number
    var next = 360*5 + deg * getRandomResult(); 

    // Flag mark state as rolling
    waitting = true;

    // Prepare time is the time to start/stop the spinner (velocity change)
    var prepareTime = waitTime / 3 * 2;
    // Roll time is the time that spinner roll with a stable velocity
    var rollTime = waitTime / 3;

    // Start roll

    // Reset roll position
    $container.css('transform', 'rotateZ(' + lastPosition + 'deg) ');
    $container.css('transition', 'none');
    $container[0].offsetHeight;

    // Roll start up
    $container.css('transition', 'transform ' + prepareTime + 's ease-in');
    $container.css('transform', 'rotateZ(' + (lastPosition + prepareTime * 1000) + 'deg) ');

    // Fast roll 
    setTimeout(function () {
        $container.css('transition', 'transform 100s linear');
        $container.css('transform', 'rotateZ(120000deg) ');
    }, prepareTime * 1000);
    
    // Wait the roll
    setTimeout(function () {
        // Stop roll
    
        // Reset roll position
        $container.css('transform', 'rotateZ(0deg)');
        $container.css('transition', 'none');
        $container[0].offsetHeight;

        // Prepare stop roll
        $container.css('transition', 'transform ' + prepareTime + 's cubic-bezier(0, 0, 0.6, 1.15)');
        $container.css('transform', 'rotateZ(' + next + 'deg) ');

        // Stop
        setTimeout(function () {
            lastPosition = next;
            waitting = false;    
            $container.css('transition', 'none');
        }, prepareTime * 1000);
    }, prepareTime * 1000 + rollTime * 1000);
}

// Handler to start the spinner
$(window).keypress(function(e) {
    if (e.which === 32) {
        e.preventDefault();
        draw();
    }
});
$("#dvName").click(function(){
    draw();
});

// Set up when the document is ready
$(setUp);
