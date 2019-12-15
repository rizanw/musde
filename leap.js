import Leap from 'leapjs';

// Setup Leap loop with frame callback function
var controllerOptions = {loopWhileDisconnected: true};

// var to save hand position
var handPos = { x: 0, y: 0 };

var controller = Leap.loop(controllerOptions, function (frame) {
    
    // Body of callback function
    console.log("id: " + frame.id + "; timestamp: " + frame.timestamp);
    console.log("hand: " + frame.hands.length + "; finger: " + frame.fingers.length);

    // hand callback 
    if (frame.hands.length > 0) {
        var hand = frame.hands[0];
        var position = hand.palmPosition;
        var velocity = hand.palmVelocity;
        var direction = hand.direction;

        handPos = { x: position[0], y: position[1] };
        console.log("hand position: " + JSON.stringify(handPos));

        console.log("Hand is " + handStateFromHistory(hand, 10));
        // var normal = hand.palmNormal;
        // console.log("Normal palm: " + normal);

        // var radius = hand.sphereRadius;
        // console.log("Sphere Radius: " + radius);
    }
})

function isLeapConnected(controller){
    if (controller.devices == undefined)
        return 0;
    return 1; 
}

if( isLeapConnected(controller) == 1)
console.log("not connected");

function handStateFromHistory(hand, historySamples) {
    if (hand.grabStrength == 1) return "closed";
    else if (hand.grabStrength == 0) return "open";
    else {
        var sum = 0
        for (var s = 0; s < historySamples; s++) {
            var oldHand = controller.frame(s).hand(hand.id)
            if (!oldHand.valid) break;
            sum += oldHand.grabStrength
        }
        var avg = sum / s;
        if (hand.grabStrength - avg < 0) return "opening";
        else if (hand.grabStrength > 0) return "closing";
    }
    return "not detected";
}
