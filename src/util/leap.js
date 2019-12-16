import Leap from 'leapjs';

export function isHandDetected(frame){
    if (frame.hands.length > 0) {
        return true;
    }else{
        return false;
    }
}

export function handleHandPos(frame, mousePos)
{
    if (frame.hand == undefined)
        return mousePos;
        
    if (frame.hands.length > 0) {
        var hand = frame.hands[0];

        var position = hand.palmPosition;
        var handPos = { x: position[0], y: position[1] };
        var tx = (position[0] / 235);
        var ty = (position[1] - 300) / 150;
        if(tx > 1) tx = 1; 
        if(tx < -1) tx = -1;
        if(ty > 1) ty = 1; 
        if(ty < -1) ty = -1;

        handPos = { x: tx, y: ty};
    } 

    return handPos;
}

var handStateFrames = [];
var sum = 0; var s = 0; var avg = 0;
export function handleHandState(hand, historySamples) {
    handStateFrames.push(hand);
    // console.log(hand)
    if (hand.grabStrength == 1) return "closed";
    else if (hand.grabStrength == 0) return "open";
    else {
        // for (var s = 0; s < historySamples; s++) {
        //     var oldHand = controller.frame(s).hand(hand.id) 
        //     if (!oldHand.valid) break;
        //     sum += oldHand.grabStrength
        // }
        // var avg = sum / s; 
        
        s+=1;
        if(s == historySamples){
            s = 0;
            sum = 0;
        }
        if(hand.valid){
            sum+= hand.grabStrength;
        }
        avg = sum/s;

        if (hand.grabStrength - avg < 0) return "opening";
        else if (hand.grabStrength > 0) return "closing";
    }
    return "not detected";
}
