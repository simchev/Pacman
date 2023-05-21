function keyDownEvent(event) {
    if ([37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }
    
    switch(event.keyCode) {
        case 87: // W
        case 38: // UP
            objMap.pacman.changeDirection(Direction.UP);
            break;
        case 83: // S
        case 40: // DOWN
            objMap.pacman.changeDirection(Direction.DOWN);
            break;
        case 68: // D
        case 39: // RIGHT
            objMap.pacman.changeDirection(Direction.RIGHT);
            break;
        case 65: // A
        case 37: // LEFT
            objMap.pacman.changeDirection(Direction.LEFT);
            break;
    }
}

//var placeStuff = false;
function mouseMoveEvent(event) {
    /*if (placeStuff) {
        var pos = new Point();
        pos.getPosition(event, objCanvasMap);
        var tilePos = new Point(Math.floor(pos.x / objMap.tileSize), Math.floor(pos.y / objMap.tileSize));
        var tile = objMap.getTile(tilePos);
        if (tile != null) {
            tile.data = TileType.WALL;
            for (var x = tilePos.x - 1; x <= tilePos.x + 1; x++) {
                for (var y = tilePos.y - 1; y <= tilePos.y + 1; y++) {
                    var t = objMap.getTile(x, y);
                    if (t != null) t.update(objMap);
                }
            }
            objMap.foodNeedRedraw = true;
            objMap.draw(objC2DMap);
            objMap.draw(objC2DFood, true);
        }
    }*/
}

function mouseUpEvent(event) {
    /*placeStuff = false;*/
}

function mouseDownEvent(event) {
    /*placeStuff = true;*/
}