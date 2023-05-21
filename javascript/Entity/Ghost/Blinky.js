var Blinky = {
    color: 'red',
    mode: GhostMode.SCATTER,
    startPos: new Point(15.0, 14.5),
    startDirection: Direction.LEFT,
    defaultTarget: new Point(26.5, 0.5),
    foodLimitStart: 0,
    foodLimit: 0,
    
    updateTarget: function(target, position, mode, pacmanPosition, pacmanDirection, blinkyTarget, blinkyPosition) {
        target.x = pacmanPosition.x;
        target.y = pacmanPosition.y;
        target.middle();
    }
}