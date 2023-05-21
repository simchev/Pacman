var Inky = {
    color: 'cyan',
    mode: GhostMode.GHOST_HOUSE,
    startPos: new Point(13.0, 17.5),
    startDirection: Direction.UP,
    defaultTarget: new Point(28.5, 34.5),
    foodLimitStart: 30,
    foodLimit: 17,
    
    updateTarget: function(target, position, mode, pacmanPosition, pacmanDirection, blinkyTarget, blinkyPosition) {
        var pos = new Point(pacmanPosition);
        pos.addDirection(pacmanDirection, 2);
        pos.middle();

        var vector = new Point(pos.x - blinkyPosition.x, pos.y - blinkyPosition.y);
        target.x = pos.x + vector.x;
        target.y = pos.y + vector.y;
        target.middle();
    }
}