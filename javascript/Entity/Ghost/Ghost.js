function Ghost(map, ghost) {
	this.map = map;
	this.ghost = ghost;
	this.movementSpeed = 8;
    this.radius = map.tileSize * 0.75;
    this.width = this.radius * 2;
    this.height = this.width;
    this.eyeRadius = this.radius * 0.4;
    this.eyeX = this.radius * 0.35;
    this.eyeY = -this.radius * 0.6;
    this.diameter = this.radius * 2;
	this.halfRadius = this.radius / 2;
	this.waveCount = 5;
	this.waveSpeed = 50;
	this.waveDistance = this.diameter / this.waveCount;
	this.halfWaveDistance = this.waveDistance / 2;
	this.elapsed = 0;
	this.alreadyEaten = false;
	
    this.mode = null;
	this.position = new Point();
	this.direction = Direction.NONE;
    this.target = new Point();
    this.updateTarget = null;
	this.frightenedFlash = false;
	this.frightenedFlashTime = 0.5;
    
	this.init();
}

Ghost.prototype.init = function() {
    this.mode = this.ghost.mode;
	this.position.x = this.ghost.startPos.x;
	this.position.y = this.ghost.startPos.y;
    this.target.x = this.ghost.defaultTarget.x;
    this.target.y = this.ghost.defaultTarget.y;
    this.direction = this.ghost.startDirection;
    this.updateTarget = this.ghost.updateTarget;
	this.enteredHouse = false;
};

Ghost.prototype.update = function(elapsed) {
	this.elapsed += elapsed;
	
	if (this.map.frightened && this.map.frightenedTime <= 4 && !this.alreadyEaten) {
		var step = Math.floor(this.map.frightenedTime / this.frightenedFlashTime);
		this.frightenedFlash = step % 2 == 0;
	} else {
		this.frightenedFlash = false;
	}
    
	var tileToMove =  this.movementSpeed * elapsed;
    if (this.mode == GhostMode.SCATTER) {
        this.target.x = this.ghost.defaultTarget.x;
        this.target.y = this.ghost.defaultTarget.y;
    } else if (this.mode == GhostMode.CHASE) {
        this.updateTarget(this.target, this.position, this.mode, this.map.pacman.getMiddleTile(), this.map.pacman.getDirection(), this.map.blinky.target, this.map.blinky.getMiddleTile());
    } else if (this.mode == GhostMode.EXIT_HOUSE) {
		this.target.x = this.map.width / 2 - 1;
		this.target.y = 0;
	} else if (this.mode == GhostMode.ENTER_HOUSE) {
		this.target.x = this.map.houseEnterX;
		this.target.y = this.map.houseEnterY + (this.enteredHouse ? 4 : 0);
	}
    
    this.map.moveEntity(this, tileToMove);
	
	if (this.mode == GhostMode.EXIT_HOUSE) {
		if (this.position.y <= this.map.houseExitY) {
			this.mode = this.map.frightened && !this.alreadyEaten ? GhostMode.FRIGHTENED : this.map.ghostMode;
		}
	} else if (this.mode == GhostMode.ENTER_HOUSE) {
		if (!this.enteredHouse && this.position.x > this.map.houseEnterX - 0.25 && this.position.x < this.map.houseEnterX + 0.25 && Math.floor(this.position.y) == Math.floor(this.map.houseEnterY)) {
			this.direction = Direction.DOWN;
			this.enteredHouse = true;
		} else if (this.enteredHouse && this.position.x > this.map.houseEnterX - 0.25 && this.position.x < this.map.houseEnterX + 0.25 && Math.floor(this.position.y) == Math.floor(this.map.houseEnterY + 4)) {
			this.direction = Direction.UP;
			this.enteredHouse = false;
			this.mode = GhostMode.EXIT_HOUSE;
			this.map.ghostReturningToHouse--;
			if (this.map.ghostReturningToHouse <= 0) {
				SoundManager.stop(Sound.GHOST_ENTERING_HOUSE);
				if (this.map.frightened) {
					SoundManager.play(Sound.FRIGHTENED);
				} else {
					SoundManager.play(Sound.POLICE);
				}
			}
		}
	}
};

Ghost.prototype.draw = function(context) {
	var x = this.position.x * this.map.tileSize;
	var y = this.position.y * this.map.tileSize;
	var frightened = this.map.frightened && !this.alreadyEaten;
	context.save();
	context.translate(x, y);
	
	if (this.mode != GhostMode.ENTER_HOUSE) {
		var rotation = Direction.getAngle(this.direction);
		
		var color = !frightened ? this.ghost.color : 'blue';
		var detailColor = 'white';
		if (this.frightenedFlash) {
			color = 'white';
			detailColor = 'blue';
		}
		// Drawing basic shape
		
		context.shadowColor = this.ghost.color;
		context.shadowBlur = this.radius * 4;
		drawCircle(context, 0, 0, this.radius, 0, Math.PI, true, color);
		context.fillRect(-this.radius, -0.5, this.diameter, this.halfRadius + 1);
		context.shadowBlur = 0;
		
		if (frightened) {
			context.beginPath();
			context.strokeStyle = detailColor;
			context.lineWidth = '1';
			context.moveTo(-15, 7);
			context.lineTo(-10, 2);
			context.lineTo(-5, 7);
			context.lineTo(0, 2);
			context.lineTo(5, 7);
			context.lineTo(10, 2);
			context.lineTo(15, 7);
			context.stroke();
		}
		
		// Drawing waves
		context.save();
		context.translate(-this.radius, this.halfRadius + this.halfRadius / 2);
		context.rect(0, -this.halfRadius / 2, this.radius * 2, this.halfRadius * 2);
		context.clip();
		context.beginPath();
		var offset = this.elapsed * this.waveSpeed % (this.waveDistance * 2);
		context.moveTo(-offset, -this.halfRadius / 2);
		context.lineTo(-offset, 0);
		
		for (var i = 0; i < this.waveCount + 2; i++) {
			var delta = i * this.waveDistance;
			context.quadraticCurveTo(delta + this.halfWaveDistance - offset, (i % 2 == 0 ? this.halfRadius : -this.halfRadius), delta + this.waveDistance - offset, 0);
		}
		context.lineTo(this.waveDistance * (this.waveCount + 1), -this.halfRadius / 2);
		context.closePath();
		context.fill();
		context.restore();
	}
    // Drawing eyes
	if (!frightened || this.mode == GhostMode.ENTER_HOUSE) {
		drawEye(context, this.eyeX, this.mode == GhostMode.ENTER_HOUSE ? 0 : this.eyeY, this.eyeRadius, this.direction);
		drawEye(context, -this.eyeX, this.mode == GhostMode.ENTER_HOUSE ? 0 : this.eyeY, this.eyeRadius, this.direction);
	} else {
		drawEye(context, this.eyeX - 12, this.eyeY, this.eyeRadius / 2 ,this.direction, detailColor, detailColor);
		drawEye(context, -this.eyeX + 12, this.eyeY, this.eyeRadius / 2 ,this.direction, detailColor, detailColor);
	}
	context.restore();
    
    // Target
	/*context.lineWidth = 2;
    context.strokeStyle = this.ghost.color;
    context.beginPath();
    context.moveTo((this.target.x - 0.5) * this.map.tileSize, (this.target.y - 0.5) * this.map.tileSize);
    context.lineTo((this.target.x + 0.5) * this.map.tileSize, (this.target.y + 0.5) * this.map.tileSize);
    context.stroke();
    context.beginPath();
    context.moveTo((this.target.x + 0.5) * this.map.tileSize, (this.target.y - 0.5) * this.map.tileSize);
    context.lineTo((this.target.x - 0.5) * this.map.tileSize, (this.target.y + 0.5) * this.map.tileSize);
    context.stroke();*/
};

Ghost.prototype.flipDirection = function() {
    var dir = this.direction;
    this.direction = Direction.inverse(this.direction);
};

Ghost.prototype.setMode = function(mode) {
    if (this.mode != mode) {
		if (this.mode == GhostMode.CHASE || this.mode == GhostMode.SCATTER || this.mode == GhostMode.FRIGHTENED || this.mode == GhostMode.GHOST_HOUSE && mode == GhostMode.EXIT_HOUSE) {
        	if (this.shouldFlip(mode)) this.flipDirection();
			this.mode = mode;
		}
    }
};

Ghost.prototype.shouldFlip = function(mode) {
	return (this.mode == GhostMode.CHASE || this.mode == GhostMode.SCATTER) && (mode == GhostMode.CHASE || mode == GhostMode.SCATTER || mode == GhostMode.FRIGHTENED);
}

Ghost.prototype.getDirection = function() {
	return this.direction;
};

Ghost.prototype.getPosition = function() {
	return this.position;
};

Ghost.prototype.getMiddleTile = function() {
    return new Point(Math.floor(this.position.x) + 0.5, Math.floor(this.position.y) + 0.5);
};

Ghost.prototype.canGoInTile = function(tile, from, direction, entity) {
    var noUp = from.getType() == TileType.NO_UP && direction == Direction.UP;
	var canPassGate = tile.getType() == TileType.GATE && ((entity.mode == GhostMode.ENTER_HOUSE && direction == Direction.DOWN && entity.enteredHouse) || (entity.mode == GhostMode.EXIT_HOUSE && direction == Direction.UP));
    
	return tile.isOut() || tile.isPath() && !noUp || tile.getType() == TileType.BLOCKED || canPassGate;
};

Ghost.prototype.wantToTurn = function(directions) {
	var inverseDir = Direction.inverse(this.direction);
	
	if (BU.contains(directions, inverseDir)) directions ^= inverseDir;
	
    var middle = new Point(Math.floor(this.position.x) + 0.5, Math.floor(this.position.y) + 0.5);
	var dirArray = Direction.toArray(directions);
    
    if (this.mode == GhostMode.FRIGHTENED) {
        var newDirection = dirArray[Math.floor(Math.random() * dirArray.length)];
        if (newDirection != this.direction) {
            this.lastDirection = this.direction;
            this.direction = newDirection;
        }
    } else if (this.mode == GhostMode.GHOST_HOUSE) {
        if (!BU.contains(directions, this.direction)) this.direction = Direction.inverse(this.direction);
    } else {
        var shortestToTarget = Direction.NONE;
        var shortestDistance = Infinity;
        for (var i = 0; i < dirArray.length; i++) {
            var p = new Point(middle);
            p.addDirection(dirArray[i], 1);
            var dist = p.distanceNoSqrt(this.target);
            if (dist <= shortestDistance) {
                shortestDistance = dist;
                shortestToTarget = dirArray[i];
            }
        }
        if (shortestToTarget != this.direction) {
            this.direction = shortestToTarget;
        }
    }
    return this.direction;
};

Ghost.prototype.adjust = function() {
    return !(this.mode == GhostMode.GHOST_HOUSE || this.mode == GhostMode.EXIT_HOUSE || this.mode == GhostMode.ENTER_HOUSE && this.enteredHouse);
};

Ghost.prototype.setPosition = function(newPos) {
   if (newPos != null) this.position = newPos;
};

Ghost.prototype.setPosition = function(newPos) {
   if (newPos != null) this.position = newPos;
};

Ghost.prototype.stop = function() {
    this.direction = Direction.NONE;
};

Ghost.prototype.applyPenalty = function(distance, tile) {
	if (this.mode == GhostMode.ENTER_HOUSE) return distance * 2;
	else if (this.mode == GhostMode.EXIT_HOUSE || this.mode == GhostMode.GHOST_HOUSE) return distance * 0.5;
	else if (this.mode == GhostMode.FRIGHTENED) return distance * 0.5;
	else if (TileType.slowdown(tile.data)) return distance * 0.4;
	else return distance;
};