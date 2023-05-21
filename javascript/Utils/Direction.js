var Direction = {
	NONE: 0,       // 0000
	LEFT: 1,       // 0001
	RIGHT: 2,      // 0010
	UP: 4,         // 0100
	DOWN: 8,       // 1000
    UP_LEFT: 5,    // 0101
    UP_RIGHT: 6,   // 0110
    DOWN_LEFT: 9,  // 1001
    DOWN_RIGHT: 10,// 1010
	
    getAngle: function(direction) {
        switch(direction) {
            case Direction.RIGHT:
                return 0;
            case Direction.DOWN:
                return Math.PI * 0.5;
            case Direction.LEFT:
                return Math.PI;
            case Direction.UP:
                return Math.PI * 1.5;
            case Direction.UP_RIGHT:
                return Math.PI * 1.75;
            case Direction.DOWN_RIGHT:
                return Math.PI * 0.25
            case Direction.DOWN_LEFT:
                return Math.PI * 0.75;
            case Direction.UP_LEFT:
                return Math.PI * 1.25;
            default:
                return 0;
        }
    },
    
    isTurning: function(dir1, dir2) {
        return ((dir1 & (Direction.UP | Direction.DOWN)) != Direction.NONE && (dir2 & (Direction.LEFT | Direction.RIGHT)) != Direction.NONE) ||
               ((dir1 & (Direction.LEFT | Direction.RIGHT)) != Direction.NONE && (dir2 & (Direction.UP | Direction.DOWN)) != Direction.NONE)
    },
    
    inverse: function(direction) {
        if (direction == Direction.UP) return Direction.DOWN;
        else if (direction == Direction.DOWN) return Direction.UP;
        else if (direction == Direction.LEFT) return Direction.RIGHT;
        else if (direction == Direction.RIGHT) return Direction.LEFT;
        else if (direction == Direction.UP_LEFT) return Direction.DOWN_RIGHT;
        else if (direction == Direction.UP_RIGHT) return Direction.DOWN_LEFT;
        else if (direction == Direction.DOWN_LEFT) return Direction.UP_RIGHT;
        else if (direction == Direction.DOWN_RIGHT) return Direction.UP_LEFT;
    },
    
    toArray: function(directions) {
    	var array = new Array();
    	
		// Prioritized
    	if (BU.contains(directions, Direction.RIGHT)) array.push(Direction.RIGHT);
        if (BU.contains(directions, Direction.DOWN)) array.push(Direction.DOWN);
        if (BU.contains(directions, Direction.LEFT)) array.push(Direction.LEFT);
        if (BU.contains(directions, Direction.UP)) array.push(Direction.UP);
    	
    	return array;
    },
    
    name: function(direction) {
        switch (direction) {
            case Direction.NONE:
                return 'None';
            case Direction.LEFT:
                return 'Left';
            case Direction.RIGHT:
                return 'Right';
            case Direction.UP:
                return 'Up';
            case Direction.DOWN:
                return 'Down';
            case Direction.UP_LEFT:
                return 'Up-left';
            case Direction.UP_RIGHT:
                return 'Up-right';
            case Direction.DOWN_LEFT:
                return 'Down-left';
            case Direction.DOWN_RIGHT:
                return 'Down-right';
            default:
                return 'unknown';
        }
    }
};

var Directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];