var objCanvasMap = null;
var objCanvasFood = null;
var objCanvasEntity = null;
var objC2DMap = null;
var objC2DFood = null;
var objC2DEntity = null;
var objCycleAnimation = null;
var lastTimestamp = 0;
var objGameMode = GameModes.STARTING;

var objMap = null;

var blnPause = false;
var resetTimestamp = false;

function setStartingTimeout(timeout) {
	setTimeout(changeGameMode, timeout, GameModes.NORMAL);
}

function restart() {
	objGameMode = GameModes.STARTING;
	initGame();
}

function startAfterDeath() {
	objMap.initEntity();
	objMap.pacman.resetDeath();
	objMap.pacman.spareLives--;
	objMap.eatenGhostStack = 0;
	changeGameMode(GameModes.STARTING);
}

function finiManger() {
	SoundManager.play(Sound.GHOST_ENTERING_HOUSE);
	objGameMode = GameModes.NORMAL;
	objMap.eatenGhostStack++;
	if (objMap.eatenGhostStack == 4) {
		objMap.eatenGhostStack = 0;
	}
}

function changeGameMode(gameMode) {
	objGameMode = gameMode;
	switch (gameMode) {
		case GameModes.STARTING:
			setStartingTimeout(4200); // Intro sound duration
			SoundManager.stopAll();
			break;
		case GameModes.DYING:
			objMap.pacman.dying = true;
			SoundManager.stopAll();
			SoundManager.play(Sound.DEATH);
			setTimeout(startAfterDeath, 2000);
			break;
		case GameModes.NORMAL:
			SoundManager.stopAll();
			SoundManager.play(Sound.POLICE);
			break;
		case GameModes.ENDING:
			objMap.pacman.dying = true;
			SoundManager.stopAll();
			SoundManager.play(Sound.DEATH);
			setTimeout(restart, 5000);
			break;
		case GameModes.EATING:
			setTimeout(finiManger, 500);
			break;
	}
}

function initGame() {
    objCanvasMap    = document.getElementById('mapCanvas');
    objCanvasFood   = document.getElementById('foodCanvas');
    objCanvasEntity = document.getElementById('entityCanvas');
    objC2DMap       = objCanvasMap.getContext('2d');
    objC2DFood      = objCanvasFood.getContext('2d');
    objC2DEntity    = objCanvasEntity.getContext('2d');

    objMap          = new Map(24);

    objMap.draw(objC2DMap);
    objMap.draw(objC2DFood, true);
	
	setStartingTimeout(4200); // Intro sound duration
    gameLoop(0, true);
	SoundManager.stopAll();
	SoundManager.play(Sound.INTRO);
}

function gameLoop(timestamp) {
    timestamp /= 1000;
	if (resetTimestamp == true) {
		resetTimestamp = false;
		lastTimestamp = timestamp;
	}

	var elapsed = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (!blnPause) objCycleAnimation = requestAnimationFrame(gameLoop);

	if (objGameMode == GameModes.NORMAL) {
		update(elapsed);
	} else if (objGameMode == GameModes.DYING || objGameMode == GameModes.ENDING) {
		objMap.pacman.updateDeath(elapsed);
	}
	
	draw();
}

function update(elapsed) {
	objMap.update(elapsed);
}

function draw() {
    if (objMap.foodNeedRedraw) {
        objC2DFood.clearRect(0, 0, objCanvasFood.width, objCanvasFood.height);
        objMap.draw(objC2DFood, true);
    }
	objMap.drawSuperFood(objC2DFood);
    
    objC2DEntity.clearRect(0, 0, objCanvasEntity.width, objCanvasEntity.height);
    objC2DEntity.save();
    objMap.applyClip(objC2DEntity);
    objMap.drawEntity(objC2DEntity, objGameMode == GameModes.DYING || objGameMode == GameModes.ENDING);
    objC2DEntity.restore();
    
    drawText(objC2DEntity, 'SCORE', objCanvasMap.width / 2, objMap.tileSize, 'white', 'center', 'middle', '25px Impact');
    drawText(objC2DEntity, objMap.pacman.score.toString(), objCanvasMap.width / 2, objMap.tileSize * 2, 'white', 'center', 'middle', '20px Impact');
	
	if (objGameMode == GameModes.STARTING) {
		drawText(objC2DEntity, 'SOYEZ PRET!', objCanvasMap.width / 2, objMap.tileSize * 20.5, 'white', 'center', 'middle', '30px Impact');
	}
	
	if (objGameMode == GameModes.ENDING) {
		drawText(objC2DEntity, 'GAME OVER', objCanvasMap.width / 2, objMap.tileSize * 20.5, 'white', 'center', 'middle', '30px Impact');
	}
	
	if (objGameMode == GameModes.EATING) {
		drawText(objC2DEntity, objMap.getGhostScore(), objMap.pacman.position.x * objMap.tileSize, objMap.pacman.position.y * objMap.tileSize, 'red', 'center', 'middle', '25px Impact');
	}
	
	if (objGameMode == GameModes.PAUSED) {
		drawText(objC2DEntity, 'PAUSED', objCanvasMap.width / 2, objMap.tileSize * 20.5, 'white', 'center', 'middle', '30px Impact');
	}
}

function pause(pause) {
	if (pause) {
		blnPause = true;
		SoundManager.pauseAll();
	} else {
		if (blnPause) {
			blnPause = false;
			resetTimestamp = true;
			objCycleAnimation = requestAnimationFrame(gameLoop);
			SoundManager.resumeAll();
		} else {
			blnPause = false;
		}
	}
}