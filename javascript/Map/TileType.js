//  +------+------+----+----+----+----+
//  | path | wall | id | id | id | id |
//  +------+------+----+----+----+----+
//   p w i i i i
//  3216 8 4 2 1
//   1 0 0 0 0 0 = 32  Path
//   0 1 0 0 0 1 = 17  Wall
//   0 0 0 0 1 0 = 2   Blocked
//   1 0 0 0 1 1 = 35  Out
//   0 0 0 1 0 0 = 20  Gate
//   1 0 0 1 0 1 = 37  NO_UP

var TILE_TYPE_BIT = 63;
var TILE_VISIBLE_BIT = 256;
var TILE_SLOWDOWN_BIT = 512;

var TileType = {
	PATH: 32,
    WALL: 17,
    BLOCKED: 2,
    OUT: 35,
    GATE: 4,
    NO_UP: 37,
    
    isPath: function(type) {
        return type != null && (type & 32) == 32;
    },
    
    isWall: function(type) {
        return type != null && (type & 16) == 16;
    },
    
    slowdown: function(type) {
    	return BU.contains(type, TILE_SLOWDOWN_BIT);
    }
};
