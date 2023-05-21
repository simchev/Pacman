var Pinky = {
    color: 'pink',
    mode: GhostMode.EXIT_HOUSE,
    startPos: new Point(15.0, 17.5),
    startDirection: Direction.DOWN,
    defaultTarget: new Point(3.5, 0.5),
    foodLimitStart: 0,
    foodLimit: 7,
    
    updateTarget: function(target, position, mode, pacmanPosition, pacmanDirection, blinkyTarget, blinkyPosition) {
        target.x = pacmanPosition.x
        target.y = pacmanPosition.y;
        target.addDirection(pacmanDirection, 4);
        target.middle();
    }
}