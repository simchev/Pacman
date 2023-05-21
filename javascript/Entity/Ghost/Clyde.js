var Clyde = {
    color: 'orange',
    mode: GhostMode.GHOST_HOUSE,
    startPos: new Point(17, 17.5),
    startDirection: Direction.UP,
    defaultTarget: new Point(1.5, 34.5),
    foodLimitStart: 90,
    foodLimit: 32,
    
    updateTarget: function(target, position, mode, pacmanPosition, pacmanDirection, blinkyTarget, blinkyPosition) {
        var distance = position.distance(pacmanPosition);

        if (distance < 8) {
            target.x = Clyde.defaultTarget.x;
            target.y = Clyde.defaultTarget.y;
        } else {
            target.x = pacmanPosition.x;
            target.y = pacmanPosition.y;
            target.middle();
        }
    }
}