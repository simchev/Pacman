// TileType.BLOCKED Bits for foods and 6 bits for the tile type
// | visible | have food | food type | type | type | type | type | type | type |
// Converted to decimal

var DEFAULT_MAP = {
    width:        30,
    height:       36,
    clipX:         1,
    clipY:         0,
    clipWidth:    28,
    clipHeight:   36,
    data:       null,
	houseExitY: 15.0,
	houseEnterX:15.0,
	houseEnterY:14.5
}
initDefaultMapData();

function initDefaultMapData() {
    var b = TileType.BLOCKED;
    var w = TileType.WALL;
    var g = TileType.GATE;
    var p = TileType.PATH;
    var f = TileType.PATH | FoodType.NORMAL;
    var s = TileType.PATH | FoodType.SUPER;
    var t = TileType.PATH | TILE_SLOWDOWN_BIT;
    var i = TileType.WALL | TILE_VISIBLE_BIT;
    var n = TileType.NO_UP;
    var m = TileType.NO_UP | FoodType.NORMAL;
    
    DEFAULT_MAP.data = [
        [ b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b],
        [ b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b],
        [ b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b],
        [ b,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  b],
        [ b,  w,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  w,  w,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  w,  b],
        [ b,  w,  f,  w,  w,  w,  w,  f,  w,  w,  w,  w,  w,  f,  w,  w,  f,  w,  w,  w,  w,  w,  f,  w,  w,  w,  w,  f,  w,  b],
        [ b,  w,  s,  w,  w,  w,  w,  f,  w,  w,  w,  w,  w,  f,  w,  w,  f,  w,  w,  w,  w,  w,  f,  w,  w,  w,  w,  s,  w,  b],
        [ b,  w,  f,  w,  w,  w,  w,  f,  w,  w,  w,  w,  w,  f,  w,  w,  f,  w,  w,  w,  w,  w,  f,  w,  w,  w,  w,  f,  w,  b],
        [ b,  w,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  w,  b],
        [ b,  w,  f,  w,  w,  w,  w,  f,  w,  w,  f,  w,  w,  w,  w,  w,  w,  w,  w,  f,  w,  w,  f,  w,  w,  w,  w,  f,  w,  b],
        [ b,  w,  f,  w,  w,  w,  w,  f,  w,  w,  f,  w,  w,  w,  w,  w,  w,  w,  w,  f,  w,  w,  f,  w,  w,  w,  w,  f,  w,  b],
        [ b,  w,  f,  f,  f,  f,  f,  f,  w,  w,  f,  f,  f,  f,  w,  w,  f,  f,  f,  f,  w,  w,  f,  f,  f,  f,  f,  f,  w,  b],
        [ b,  w,  w,  w,  w,  w,  w,  f,  w,  w,  w,  w,  w,  p,  w,  w,  p,  w,  w,  w,  w,  w,  f,  w,  w,  w,  w,  w,  w,  b],
        [ b,  b,  b,  b,  b,  b,  w,  f,  w,  w,  w,  w,  w,  p,  w,  w,  p,  w,  w,  w,  w,  w,  f,  w,  b,  b,  b,  b,  b,  b],
        [ b,  b,  b,  b,  b,  b,  w,  f,  w,  w,  p,  p,  p,  n,  p,  p,  n,  p,  p,  p,  w,  w,  f,  w,  b,  b,  b,  b,  b,  b],
        [ b,  b,  b,  b,  b,  b,  w,  f,  w,  w,  p,  w,  w,  w,  g,  g,  w,  w,  w,  p,  w,  w,  f,  w,  b,  b,  b,  b,  b,  b],
        [ i,  w,  w,  w,  w,  w,  w,  f,  w,  w,  p,  w,  b,  b,  b,  b,  b,  b,  w,  p,  w,  w,  f,  w,  w,  w,  w,  w,  w,  i],
        [ t,  t,  t,  t,  t,  t,  t,  f,  p,  p,  p,  w,  b,  b,  b,  b,  b,  b,  w,  p,  p,  p,  f,  t,  t,  t,  t,  t,  t,  t],
        [ i,  w,  w,  w,  w,  w,  w,  f,  w,  w,  p,  w,  b,  b,  b,  b,  b,  b,  w,  p,  w,  w,  f,  w,  w,  w,  w,  w,  w,  i],
        [ b,  b,  b,  b,  b,  b,  w,  f,  w,  w,  p,  w,  w,  w,  w,  w,  w,  w,  w,  p,  w,  w,  f,  w,  b,  b,  b,  b,  b,  b],
        [ b,  b,  b,  b,  b,  b,  w,  f,  w,  w,  p,  p,  p,  p,  p,  p,  p,  p,  p,  p,  w,  w,  f,  w,  b,  b,  b,  b,  b,  b],
        [ b,  b,  b,  b,  b,  b,  w,  f,  w,  w,  p,  w,  w,  w,  w,  w,  w,  w,  w,  p,  w,  w,  f,  w,  b,  b,  b,  b,  b,  b],
        [ b,  w,  w,  w,  w,  w,  w,  f,  w,  w,  p,  w,  w,  w,  w,  w,  w,  w,  w,  p,  w,  w,  f,  w,  w,  w,  w,  w,  w,  b],
        [ b,  w,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  w,  w,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  w,  b],
        [ b,  w,  f,  w,  w,  w,  w,  f,  w,  w,  w,  w,  w,  f,  w,  w,  f,  w,  w,  w,  w,  w,  f,  w,  w,  w,  w,  f,  w,  b],
        [ b,  w,  f,  w,  w,  w,  w,  f,  w,  w,  w,  w,  w,  f,  w,  w,  f,  w,  w,  w,  w,  w,  f,  w,  w,  w,  w,  f,  w,  b],
        [ b,  w,  s,  f,  f,  w,  w,  f,  f,  f,  f,  f,  f,  m,  p,  p,  m,  f,  f,  f,  f,  f,  f,  w,  w,  f,  f,  s,  w,  b],
        [ b,  w,  w,  w,  f,  w,  w,  f,  w,  w,  f,  w,  w,  w,  w,  w,  w,  w,  w,  f,  w,  w,  f,  w,  w,  f,  w,  w,  w,  b],
        [ b,  w,  w,  w,  f,  w,  w,  f,  w,  w,  f,  w,  w,  w,  w,  w,  w,  w,  w,  f,  w,  w,  f,  w,  w,  f,  w,  w,  w,  b],
        [ b,  w,  f,  f,  f,  f,  f,  f,  w,  w,  f,  f,  f,  f,  w,  w,  f,  f,  f,  f,  w,  w,  f,  f,  f,  f,  f,  f,  w,  b],
        [ b,  w,  f,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  f,  w,  w,  f,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  f,  w,  b],
        [ b,  w,  f,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  f,  w,  w,  f,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  f,  w,  b],
        [ b,  w,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  f,  w,  b],
        [ b,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  w,  b],
        [ b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b],
        [ b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b,  b]
    ];
}