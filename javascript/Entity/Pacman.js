function Pacman(map, x, y) {
	this.map = map;
	this.position = new Point(x, y);
	this.lastPosition = this.position;
	this.color = 'khaki';
	this.borderColor = 'black';
	this.borderWidth = 3;
	this.direction = Direction.LEFT;
    this.lastDirection = Direction.LEFT;
	this.nextDirection = Direction.NONE;
    this.opened = false;
    this.radius = map.tileSize * 0.75;
    this.width = this.radius * 2;
    this.height = this.width;
    this.elapsedEatTime = 0;
    this.movementSpeed = 8;
    this.eatingSpeed = 1 / this.movementSpeed;
    this.score = 0;
    this.spareLives = 2;
    this.movePenalty = 0;
	this.dyingTime = 2;
	this.dying = false;
}

Pacman.prototype.update = function(elapsed) {
	this.elapsedEatTime += elapsed;
	
	if (this.elapsedEatTime >= this.eatingSpeed) {
		this.opened = !this.opened;
		this.elapsedEatTime = 0;
	}
    
    var tileToMove =  this.movementSpeed * elapsed;
    this.map.moveEntity(this, tileToMove, true);
};

Pacman.prototype.updateDeath = function(elapsed) {
	if (this.dying) {
		this.dyingTime -= elapsed;
		if (this.dyingTime < 0) {
			this.dyingTime = 0;
		}
	}
}

Pacman.prototype.resetDeath = function() {
	this.dying = false;
	this.dyingTime = 2;
	this.opened = false;
}

function drawPacman(context, x, y, direction, radius, reallyOpened, color, borderColor, lineWidth) {
	var rotation = Direction.getAngle(direction);
	var angle1 = Math.PI * (reallyOpened ? 0.2 : 0) + rotation;
	var angle2 = Math.PI * (reallyOpened ? -0.2 : 2) + rotation;
	
	context.shadowColor = color;
    context.shadowBlur = radius * 4;
	drawCircle(context, x, y, radius, angle1, angle2, false, color);
    context.shadowBlur = 0;
    context.lineWidth = lineWidth;
    context.strokeStyle = borderColor;
    context.lineJoin = 'round';
    context.stroke();
    
    var eyeX = radius * 0.3;
    var eyeY = -radius * 0.6 * (direction == Direction.LEFT ? -1 : 1);
    var eyeRadius = radius * 0.35;
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    drawEye(context, eyeX, eyeY, eyeRadius, Direction.RIGHT, 'white');
    context.restore();
}

Pacman.prototype.draw = function(context) {
	var tileSize = this.map.tileSize;
	var x = this.position.x * tileSize;
	var y = this.position.y * tileSize;
	
	if (!this.dying) {
		drawPacman(context, x, y, this.getDirection(), this.radius, this.direction != Direction.NONE && this.opened, this.color, this.borderColor, this.borderWidth);
	} else {
		context.save();
		context.translate(x, y);
		context.rotate(Direction.getAngle(this.getDirection()));
		var angle1 = this.dyingTime != 0 ? Math.PI - Math.PI * (this.dyingTime / 2) : 0;
		var angle2 = -angle1;
		drawCircle(context, 0, 0, this.radius, angle1, angle2, false, this.color);
		context.restore();
	}
    
    for (var i = 0; i < this.spareLives; i++) {
    	drawPacman(context, (3.5 + (2 * i)) * tileSize, 35 * tileSize, Direction.LEFT, this.radius, true, this.color, this.borderColor, this.lineWidth);
    }
};

Pacman.prototype.canGoInTile = function(tile, from, direction) {
    return tile == null || tile.isPath();
}

Pacman.prototype.getDirection = function() {
    return this.direction == Direction.NONE ? this.lastDirection : this.direction;
};

Pacman.prototype.getPosition = function() {
    return this.position;
};

Pacman.prototype.getMiddleTile = function() {
    return new Point(Math.floor(this.position.x) + 0.5, Math.floor(this.position.y) + 0.5);
};

Pacman.prototype.wantToTurn = function(directions) {
    if (this.nextDirection != Direction.NONE && BU.contains(directions, this.nextDirection)) {
        this.lastDirection = this.direction;
        this.direction = this.nextDirection;
        this.nextDirection = Direction.NONE;
    } else if (!BU.contains(directions, this.direction) && this.direction != Direction.NONE) {
        this.lastDirection = this.direction;
        this.direction = Direction.NONE;
    }
    return this.direction;
};

Pacman.prototype.setPosition = function(newPos) {
   if (newPos != null) this.position = newPos;
};

Pacman.prototype.changeDirection = function(direction) {
    if (direction != null) {
		this.nextDirection = direction;
    }
};

Pacman.prototype.eatFood = function(food) {
    this.score += FoodType.getScore(food);
    this.movePenalty += FoodType.getMovePenalty(food);
}

Pacman.prototype.stop = function() {
    if (this.direction != Direction.NONE) {
        this.lastDirection = this.direction;
        this.direction = Direction.NONE;
        this.nextDirection = Direction.NONE;
    }
};

Pacman.prototype.adjust = function() {
    return true;
};

Pacman.prototype.applyPenalty = function(distance, tile) {
    if (distance != null) {
		if (this.map.frightened) distance *= 1.125;
        var penalty = Math.min(distance, this.movePenalty);
        this.movePenalty -= penalty;
        return distance - penalty;
    } else {
        return 0;
    }
}