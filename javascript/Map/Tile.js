function Tile(data, position) {
	this.data = data;
    this.position = position;
    this.connection1 = null;
    this.connection2 = null;
    this.blockedSide = Direction.NONE;
}

Tile.prototype.getType = function() {
    return this.data & TILE_TYPE_BIT;
}

Tile.prototype.getFood = function() {
    return this.data & FOOD_BIT;
}

Tile.prototype.isOut = function() {
	return this.getType() == TileType.OUT;
};

Tile.prototype.isPath = function() {
    return TileType.isPath(this.getType());
};

Tile.prototype.isWall = function() {
    return TileType.isWall(this.getType());
};

Tile.prototype.isBlocked = function() {
    return this.getType() == TileType.BLOCKED;
};

Tile.prototype.haveFood = function() {
    return this.getFood() != FoodType.NONE;
};

Tile.prototype.isSuperFood = function() {
    return this.getFood() == FoodType.SUPER;
};

Tile.prototype.eatFood = function() {
    var foodType = this.getFood();
    this.data ^= foodType;
    return foodType;
};

Tile.prototype.update = function(map) {
    this.connection1 = null;
    this.connection2 = null;
    
    if (this.isWall()) {
        var side = new Array();
        var nbWall = 0;
        for (var i = 0; i < Directions.length; i++) {
            side[Directions[i]] = map.getRelative(this.position, Directions[i]);
            if (!side[Directions[i]].isPath()) nbWall++;
            if (this.getType() != TileType.GATE && side[Directions[i]].isBlocked()) {
                this.blockedSide |= Directions[i];
            }
        }

        switch (nbWall) {
            case 1:
                for (var i = 0; i < Directions.length; i++) {
                    if (side[Directions[i]].isWall()) {
                        this.connection1 = Directions[i];
                        break;
                    }
                }
                break;
            case 2:
                for (var i = 0; i < Directions.length; i++) {
                    if (side[Directions[i]].isWall()) {
                        if (this.connection1 == null) {
                            this.connection1 = Directions[i];
                        } else {
                            this.connection2 = Directions[i];
                            break;
                        }
                    }
                }
                break;
            case 3:
                var pathSide = null;
                for (var i = 0; i < Directions.length; i++) {
                    if (side[Directions[i]].isPath()) {
                        pathSide = Directions[i];
                        break;
                    }
                }
                switch (pathSide) {
                    case Direction.UP:
                    case Direction.DOWN:
                        this.connection1 = Direction.LEFT;
                        this.connection2 = Direction.RIGHT;
                        break;
                    case Direction.LEFT:
                    case Direction.RIGHT:
                        this.connection1 = Direction.UP;
                        this.connection2 = Direction.DOWN;
                        break;
                }
                break;
            case 4:
                var pathSide = null;
                var diagDir = [Direction.UP_LEFT, Direction.UP_RIGHT, Direction.DOWN_LEFT, Direction.DOWN_RIGHT];
                for (var i = 0; i < diagDir.length; i++) {
                    if (map.getRelative(this.position, diagDir[i]).isPath()) {
                        pathSide = diagDir[i];
                        break;
                    }
                }
                switch (pathSide) {
                    case Direction.UP_LEFT:
                        this.connection1 = Direction.UP;
                        this.connection2 = Direction.LEFT;
                        break;
                    case Direction.UP_RIGHT:
                        this.connection1 = Direction.UP;
                        this.connection2 = Direction.RIGHT;
                        break;
                    case Direction.DOWN_LEFT:
                        this.connection1 = Direction.DOWN;
                        this.connection2 = Direction.LEFT;
                        break;
                    case Direction.DOWN_RIGHT:
                        this.connection1 = Direction.DOWN;
                        this.connection2 = Direction.RIGHT;
                        break;
                }
                break;
        }
    }
};

Tile.prototype.draw = function(context, map, drawFood) {
    if (BU.contains(this.data, TILE_VISIBLE_BIT)) return;
    
    var middle = map.tileSize / 2;
    
    if (drawFood === true) {
        if (this.haveFood()) {
            var mfs = (this.isSuperFood() ? map.superFoodSize : map.foodSize) / 2;
            context.fillStyle = map.foodColor;
            context.beginPath();
            context.arc(middle, middle, mfs, 0, Math.PI * 2);
            context.fill();
        }
    } else {
        context.strokeStyle = map.tileColor;
        context.lineWidth = map.lineWidth;
        context.shadowColor = map.tileColor;
        context.shadowBlur = map.tileSize * 0.75;

        if (this.getType() == TileType.GATE) {
            context.fillStyle = map.gateColor;
            context.fillRect(0, middle + middle * 0.2, map.tileSize, middle * 0.6);
        } else if (this.connection1 != null && this.connection2 != null) {
            context.beginPath();
            if (this.connection1 == Direction.UP) {
                context.moveTo(middle, 0);
                if (this.connection2 == Direction.DOWN) {
                    context.lineTo(middle, map.tileSize);
                } else {
                    context.arcTo(middle, middle, this.connection2 == Direction.LEFT ? 0 : map.tileSize, middle, middle);
                }
            } else if (this.connection1 == Direction.DOWN) {
                context.moveTo(middle, map.tileSize);
                context.arcTo(middle, middle, this.connection2 == Direction.LEFT ? 0 : map.tileSize, middle, middle);
            } else {
                context.moveTo(0, middle);
                context.lineTo(map.tileSize, middle);
            }
            context.stroke();
        } else if (this.connection1 != null) {
            context.beginPath();
            context.moveTo(middle, middle);
            switch (this.connection1) {
                case Direction.UP:
                    context.lineTo(middle, 0);
                    break;
                case Direction.DOWN:
                    context.lineTo(middle, map.tileSize);
                    break;
                case Direction.LEFT:
                    context.lineTo(0, middle);
                    break;
                case Direction.RIGHT:
                    context.lineTo(map.tileSize, middle);
                    break;
            }
            context.stroke();
        }
        
        if (this.blockedSide != Direction.NONE) {
            if ((this.blockedSide & Direction.UP) == Direction.UP) {
                drawLine(context, 0, 0, map.tileSize, 0);
            }
            if ((this.blockedSide & Direction.DOWN) == Direction.DOWN) {
                drawLine(context, 0, map.tileSize, map.tileSize, map.tileSize);
            }
            if ((this.blockedSide & Direction.LEFT) == Direction.LEFT) {
                drawLine(context, 0, 0, 0, map.tileSize);
            }
            if ((this.blockedSide & Direction.RIGHT) == Direction.RIGHT) {
                drawLine(context, map.tileSize, 0, map.tileSize, map.tileSize);
            }
        }
    }
};