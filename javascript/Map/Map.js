function Map(tileSize, mapData) {
    this.tileSize = tileSize;
    this.foodSize = this.tileSize * 0.2;
	this.binSuperFoodGrowing = false;
	this.maxSuperFoodSize = this.tileSize * 0.7;
	this.minSuperFoodSize = 0.5 * this.maxSuperFoodSize;
	this.superFoodSizeDiff = this.maxSuperFoodSize - this.minSuperFoodSize;
    this.superFoodSize = this.maxSuperFoodSize;
	this.superFoodSizeSpeed = 3;
    this.lineWidth = this.tileSize * 0.2;
	this.tiles = null;
    this.tileColor = 'crimson';
    this.tileBackColor = 'black';
    this.foodColor = 'peachPuff';
    this.gateColor = 'pink';
    this.outTile = new Tile(TileType.OUT);
	this.houseExitY = 0;
	this.houseEnterX = 0;
	this.houseEnterY = 0;
	this.elapsed = 0;
	this.eatenGhostStack = 0;
	
	this.pacman = new Pacman(this, 15, 26.5);
	
	this.pinky = new Ghost(this, Pinky);
	this.blinky = new Ghost(this, Blinky);
	this.inky = new Ghost(this, Inky);
	this.clyde = new Ghost(this, Clyde);
	this.ghosts = [this.pinky, this.blinky, this.inky, this.clyde];
	
	this.ghostPhase = 0;
	this.ghostTime = 0;
	this.ghostMode = null;
	this.frightenedTime = 0;
	this.frightened = false;
	this.ghostReturningToHouse = 0;
    
	this.init(mapData);
}

Map.prototype.init = function(mapData) {
	var map = mapData == null ? DEFAULT_MAP : mapData;
	
	this.foodCounter = 0;
	this.foodNeedRedraw = true;
	
	this.width = map.width;
    this.height = map.height;
	
	this.houseExitY = map.houseExitY;
	this.houseEnterX = map.houseEnterX;
	this.houseEnterY = map.houseEnterY;
	
    this.clipX = map.clipX * this.tileSize;
    this.clipY = map.clipY * this.tileSize;
    this.clipWidth = map.clipWidth * this.tileSize;
    this.clipHeight = map.clipHeight * this.tileSize;
	
	this.tiles = new Array(this.width);
    for (var i = 0; i < this.width; i++) {
		this.tiles[i] = new Array(this.height);
	}
    
    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            var d = map.data[y][x];
            this.tiles[x][y] = new Tile(d, new Point(x, y));
			if (this.tiles[x][y].haveFood()) this.foodCounter++;
        }
    }
    
    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            this.tiles[x][y].update(this);
        }
    }
	
	this.initEntity();
	
	this.ghostPhase = 0;
	this.ghostTime = GhostTiming[this.ghostPhase].t;
	this.ghostMode = GhostTiming[this.ghostPhase].m;
	
	this.blinky.setMode(this.ghostMode);
    
    this.ghostFoodCounter = 0;
    this.firstRun = true;
};

Map.prototype.initEntity = function() {
	this.binSuperFoodGrowing = false;
	this.superFoodSize = this.maxSuperFoodSize;
	
	this.ghostPhase = 1;
	this.ghostTime = GhostTiming[this.ghostPhase].t;
	this.ghostMode = GhostTiming[this.ghostPhase].m;
	this.frightenedTime = 0;
	this.frightened = false;
	
	this.pinky.init();
	this.blinky.init();
	this.inky.init();
	this.clyde.init();
	
	this.blinky.setMode(this.ghostMode);
	
	this.pacman.position.x = 15.0;
	this.pacman.position.y = 26.5;
	this.pacman.direction = Direction.LEFT;
	this.pacman.lastDirection = Direction.NONE;
    
    this.ghostFoodCounter = 0;
    this.firstRun = false;
	
	this.ghostReturningToHouse = 0;
	
	this.elapsed = 0;
};

Map.prototype.contains = function(p1, p2) {
    if (p2 == null) {
        return p1.x >= 0 && p1.y >= 0 && p1.x < this.width && p1.y < this.height;
    } else {
        return p1 >= 0 && p2 >= 0 && p1 < this.width && p2 < this.height;
    }
};

Map.prototype.getRelative = function(pos, direction) {
    var posCopy = new Point(pos);
    posCopy.increment(direction);
    posCopy.x = Math.floor(posCopy.x);
    posCopy.y = Math.floor(posCopy.y);
	
	return this.contains(posCopy.x, posCopy.y) ? this.tiles[posCopy.x][posCopy.y] : this.outTile;
};

Map.prototype.getTile = function(p1, p2) {
    var tilePos = this.getTileAt(p1, p2);
    if (tilePos != null && this.contains(tilePos)) {
        return this.tiles[tilePos.x][tilePos.y];
    } else {
        return null;
    }
};

Map.prototype.setTile = function(p1, p2, type) {
    if (type == null) {
        this.tiles[Math.floor(p1.x)][Math.floor(p1.y)].type = p2;
    } else {
        this.tiles[Math.floor(p1)][Math.floor(p2)].type = type;
    }
};

Map.prototype.eatFood = function(p1, p2) {
    var tilePos = this.getTileAt(p1, p2);
    if (tilePos != null) {
        if (this.contains(tilePos)) {
            var t = this.tiles[tilePos.x][tilePos.y];
            var eated = t != null ? t.eatFood() : false;
            if (eated != FoodType.NONE) {
                this.ghostFoodCounter++;
                this.foodNeedRedraw = true;
				this.foodCounter--;
				
				if (eated == FoodType.SUPER) {
					SoundManager.stop(Sound.POLICE);
					SoundManager.play(Sound.FRIGHTENED);
					this.frightenedTime = 10;
					this.frightened = true;
					this.eatenGhostStack = 0;
					for (var i = 0; i < this.ghosts.length; i++) {
						if (this.ghosts[i].mode != GhostMode.ENTER_HOUSE) {
							this.ghosts[i].alreadyEaten = false;
							this.ghosts[i].setMode(GhostMode.FRIGHTENED);
						}
					}
				}
				
				SoundManager.play(Sound.WAKA, 0.25);
            }
            return eated;
        }
    } else {
        return false;   
    }
};

Map.prototype.update = function(elapsed) {
	this.elapsed += elapsed;
	
	if (this.foodCounter <= 0) {
		this.init();
		changeGameMode(GameModes.STARTING);
		SoundManager.play(Sound.INTRO);
		return;
	}
	
	var percent = this.superFoodSizeDiff * elapsed * this.superFoodSizeSpeed;
	if (this.superFoodSize >= this.maxSuperFoodSize) this.binSuperFoodGrowing = false;
	else if (this.superFoodSize <= this.minSuperFoodSize) this.binSuperFoodGrowing = true;
	this.superFoodSize += (this.binSuperFoodGrowing ? percent : -percent);
	this.superFoodSize = Math.min(this.superFoodSize, this.maxSuperFoodSize);
	this.superFoodSize = Math.max(this.superFoodSize, this.minSuperFoodSize);
	
	this.pacman.update(elapsed);
	if (this.checkCollision()) return;
	this.pinky.update(elapsed);
	this.blinky.update(elapsed);
	this.inky.update(elapsed);
	this.clyde.update(elapsed);
	
	if (!this.frightened) {
		this.ghostTime -= elapsed;
	}
	if (this.ghostTime <= 0 && this.ghostPhase < GhostTiming.length) {
		this.ghostPhase++;
		if (this.ghostPhase < GhostTiming.length) {
			this.ghostMode = GhostTiming[this.ghostPhase].m;
			this.ghostTime = GhostTiming[this.ghostPhase].t;
		} else {
			this.ghostMode = GhostMode.CHASE;
		}
		if (!this.frightened) {
			for (var i = 0; i < this.ghosts.length; i++) {
				this.ghosts[i].setMode(this.ghostMode);
			}
		}
	}
	
	for (var i = 0; i < this.ghosts.length; i++) {
		if (this.ghosts[i].mode == GhostMode.GHOST_HOUSE) {
			var foodLimit = this.firstRun ? this.ghosts[i].ghost.foodLimitStart : this.ghosts[i].ghost.foodLimit;
			if (this.ghostFoodCounter >= foodLimit) {
				this.ghosts[i].setMode(GhostMode.EXIT_HOUSE);
			}
		}
	}
	
	if (this.checkCollision()) return;
	
	if (this.frightened) {
		this.frightenedTime -= elapsed;
		if (this.frightenedTime <= 0) {
			this.eatenGhostStack = 0;
			if (this.ghostReturningToHouse <= 0) {
				SoundManager.stop(Sound.FRIGHTENED);
				SoundManager.play(Sound.POLICE);
			}
			this.frightened = false;
			for (var i = 0; i < this.ghosts.length; i++) {
				this.ghosts[i].setMode(this.ghostMode);
				this.ghosts[i].alreadyEaten = false;
				this.ghosts[i].frightenedFlash = false;
			}
		}
	}
};

Map.prototype.getGhostScore = function() {
	return 100 * Math.pow(2, this.eatenGhostStack + 1);
}

Map.prototype.checkCollision = function() {
	var pacTile = this.pacman.getMiddleTile();
	var dead = false;
	for (var i = 0; i < this.ghosts.length; i++) {
		if (pacTile.equals(this.ghosts[i].getMiddleTile())) {
			if (this.ghosts[i].mode == GhostMode.FRIGHTENED) {
				this.ghostReturningToHouse++;
				this.ghosts[i].setMode(GhostMode.ENTER_HOUSE);
				this.ghosts[i].alreadyEaten = true;
				SoundManager.stop(Sound.FRIGHTENED);
				SoundManager.play(Sound.EAT_GHOST);
				changeGameMode(GameModes.EATING);
				this.pacman.score += this.getGhostScore();
			} else if (this.ghosts[i].mode == GhostMode.CHASE || this.ghosts[i].mode == GhostMode.SCATTER) {
				dead = true;
			}
		}
	}
	if (dead) {
		if (this.pacman.spareLives > 0) {
			changeGameMode(GameModes.DYING);
		} else {
			changeGameMode(GameModes.ENDING);
		}
	}
	return dead;
};

Map.prototype.draw = function(context, drawFood) {
    if (drawFood === true) {
        if (!this.foodNeedRedraw) {
            return;
        }
        this.foodNeedRedraw = false;
        context.clearRect(0, 0, this.width * this.tileSize, this.height * this.tileSize);
    } else {
        context.fillStyle = this.tileBackColor;
        context.fillRect(0, 0, this.width * this.tileSize, this.height * this.tileSize);
        context.fillStyle = context.strokeStyle = this.tileColor;  
    }
    context.save();
    context.rect(this.clipX, this.clipY, this.clipWidth, this.clipHeight);
    context.clip();
    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            this.tiles[x][y].draw(context, this, drawFood);
            context.translate(0, this.tileSize);
        }
        context.translate(this.tileSize, 0);
        context.translate(0, -this.tileSize * this.height);
    }
    context.restore();
};

Map.prototype.drawSuperFood = function(context) {
	for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.height; y++) {
            var tile = this.tiles[x][y];
			if (tile.isSuperFood()) {
				context.save();
				context.translate(x * this.tileSize, y * this.tileSize);
				context.clearRect(0, 0, this.tileSize, this.tileSize);
				tile.draw(context, this, true);
				context.restore();
			}
        }
    }
}

Map.prototype.drawEntity = function(context, pacmanOnly) {
	this.pacman.draw(context);
	if (pacmanOnly === false) {
		this.pinky.draw(context);
		this.blinky.draw(context);
		this.inky.draw(context);
		this.clyde.draw(context);
	}
}

Map.prototype.getTileAt = function(p1, p2) {
    var x = null;
    var y = null;
    if (p2 == null) {
        if (p1 != null) {
            x = p1.x;
            y = p1.y;
        }
    } else if (p2 != null) {
        x = p1;
        y = p2;
    }
    
    if (x != null && y != null) {
        return new Point(Math.floor(x), Math.floor(y));
    } else {
        return this.outTile;
    }
};

Map.prototype.applyClip = function(context) {
    if (context != null) {
        context.rect(this.clipX, this.clipY, this.clipWidth, this.clipHeight);
        context.clip();
    }
};

Map.prototype.getOpenDirection = function(pos, direction, distance, compareFunction, entity) {
    var directions = Direction.NONE;
    if (pos != null && direction != null && distance != null && compareFunction != null) {
        var possibleDirs = new Array();
        var midX = Math.floor(pos.x) + 0.5;
        var midY = Math.floor(pos.y) + 0.5;
        if (direction == Direction.NONE || direction == Direction.RIGHT && pos.x <= midX && pos.x + distance >= midX || direction == Direction.LEFT && pos.x >= midX && pos.x - distance <= midX) {
            possibleDirs.push(Direction.UP);
            possibleDirs.push(Direction.DOWN);
        }
        if (direction == Direction.NONE || direction == Direction.DOWN && pos.y <= midY && pos.y + distance >= midY || direction == Direction.UP && pos.y >= midY && pos.y - distance <= midY) {
            possibleDirs.push(Direction.LEFT);
            possibleDirs.push(Direction.RIGHT);
        }
        if (direction != Direction.NONE) {
            possibleDirs.push(direction);
            possibleDirs.push(Direction.inverse(direction));
        }
        var tile = this.getTile(pos);
        for (var i = 0; i < possibleDirs.length; i++) {
            if (compareFunction(this.getRelative(pos, possibleDirs[i]), tile, possibleDirs[i], entity)) {
                directions |= possibleDirs[i];
            }
        }
        if (direction == Direction.LEFT && pos.x - distance > midX) directions |= Direction.LEFT;
        else if (direction == Direction.RIGHT && pos.x + distance < midX) directions |= Direction.RIGHT;
        else if (direction == Direction.UP && pos.y - distance > midY) directions |= Direction.UP;
        else if (direction == Direction.DOWN && pos.y + distance < midY) directions |= Direction.DOWN;
    }
    return directions;
};

// Entity requirement :
//   getDirection() - Direction
//   getPosition()  - Point
//   canGoInTile()  - Boolean
//   wantToTurn()   - Direction
//   setPosition()  - void
//   stop()         - void
//   If eatFood is true : eatFood() - void
var MaxMoveStep = 0.49;
Map.prototype.moveEntity = function(entity, distance, eatFood) {
    while (distance > 0) {
        var stepDist = distance > MaxMoveStep ? MaxMoveStep : distance;
        distance -= MaxMoveStep;
        var direction = entity.getDirection();
        var position = entity.getPosition();
        
        if (eatFood === true) {
            var foodType = this.eatFood(position);
            entity.eatFood(foodType);
        }
        
        stepDist = entity.applyPenalty(stepDist, this.getTile(entity.getMiddleTile()));
        if (stepDist > MaxMoveStep) {
            distance += stepDist - MaxMoveStep;
            stepDist = MaxMoveStep;
        }
        if (stepDist <= 0) continue;
        
        var openDirs = this.getOpenDirection(position, direction, stepDist, entity.canGoInTile, entity);
        var dir = entity.wantToTurn(openDirs);
        var stopping = false;
        if (dir == Direction.NONE && direction != Direction.NONE) {
            entity.stop();
            stopping = true;
        } else {
            direction = dir;
        }

        if (stopping || direction != Direction.NONE) {
            var nextPosition = new Point(position);
            nextPosition.addDirection(direction, stepDist);

            if (nextPosition.x < 0) nextPosition.x = this.width - 0.0001;
            else if (nextPosition.x >= this.width) nextPosition.x = 0;

            if (nextPosition.y < 0) nextPosition.y = this.height - 0.0001;
            else if (nextPosition.y >= this.height) nextPosition.y = 0;

            if (entity.adjust()) nextPosition.adjust(direction, !stopping);
            entity.setPosition(nextPosition);
        }
    }
};