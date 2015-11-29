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
    if ($holders.length === 0) return 0;
    // If one if the "data-rate" attributes is not available, use default rate (equally rate for all items)
    if (!$holders[0].dataset.rate) {
        return (Math.floor(Math.random() * $holders.length) + 1);
    } else {
        // Return by rate of each item
        // Create an array with number of item of each holder is exactly it's rate
        var arr = [];
        $holders.each(function (index, $holder) {
            var rate = Number($holder.dataset.rate);
            for (var i = 0; i < rate * 100; i++) {
                arr.push(index);
            }
        });
        // Random an item from that array, it's the result we want
        return arr[Math.floor(Math.random() * arr.length)];
    }
}

/**
 * Test the random function
 * Check console for result, compare with the number you put in data-rate attribute
 * Test result should looks like this:
 * Pair:  0.3  :  0.293
 * Pair:  0.25  :  0.24646
 * Pair:  0.033  :  0.0388
 * Pair:  0.333  :  0.33374
 * Pair:  0.083  :  0.088
 */
function test_getRandomResult() {
    var result = {};
    for (var i = 0; i < 100000; i++) {
        var target = getRandomResult();
        result[target] = result[target] || 0;
        ++result[target];
    }
    // Print result to console
    for (var i = 0; i < $holders.length; i++) {
        console.log('Pair: ', $holders[i].dataset.rate, ' : ', result[i] / 100000);
    }
}

/**
 * Start the spin, wait a bit, then stop it
 */ 
function draw() {
    // If state is rolling, return
    if (waitting) return;

    // The lucky number
    var result = getRandomResult();
    var next = 360*5 - deg * result; 

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
