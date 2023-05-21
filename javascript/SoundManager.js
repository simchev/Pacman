var SoundManager = {
	init: function() {
		SoundManager.enableLooping(Sound.FRIGHTENED);
		SoundManager.enableLooping(Sound.GHOST_ENTERING_HOUSE);
		SoundManager.enableLooping(Sound.POLICE);
		SoundManager.enableLooping(Sound.WAKA);
		
		SoundManager.setVolume(0.2);
	},
	
	play: function(sound, duration) {
		if (sound != null) {
			sound.play();
			if (duration != null && duration > 0) {
				if (sound.stopTimeout != null) {
					clearTimeout(sound.stopTimeout);
					sound.stopTimeout = null;
				}
				sound.stopTimeout = setTimeout(SoundManager.stop, duration * 1000, sound);
			}
		}
	},
	
	pause: function(sound) {
		if (sound != null) {
			if (!sound.paused) {
				sound.soundPaused = true;
			}
			sound.pause();
		}
	},
	
	resume: function(sound) {
		if (sound != null && sound.soundPaused === true && sound.currentTime < sound.duration) {
			sound.soundPaused = false;
			sound.play();
		}
	},
	
	stop: function(sound) {
		if (sound != null) {
			sound.soundPaused = false;
			sound.pause();
			sound.currentTime = 0;
			if (sound.stopTimeout) {
				sound.stopTimeout = null;
			}
		}
	},
	
	stopAll: function() {
		SoundManager.stop(Sound.DEATH);
		SoundManager.stop(Sound.EAT_GHOST);
		SoundManager.stop(Sound.FRIGHTENED);
		SoundManager.stop(Sound.GHOST_ENTERING_HOUSE);
		SoundManager.stop(Sound.INTRO);
		SoundManager.stop(Sound.POLICE);
		SoundManager.stop(Sound.WAKA);
	},
	
	enableLooping: function(sound, loopBuffer) {
		if (sound != null) {
			sound.preload = 'auto';
			sound.loopBuffer = loopBuffer != null ? loopBuffer : 0.135;
			sound.addEventListener('timeupdate', function() {
                if(this.currentTime > this.duration - this.loopBuffer){
                    this.currentTime = 0;
					this.play();
                }}, false);
		}
	},
	
	setVolume: function(volume) {
		volume = Math.min(volume, 1.0);
		volume = Math.max(volume, 0.0);
		
		Sound.DEATH.volume = volume;
		Sound.EAT_GHOST.volume = volume;
		Sound.FRIGHTENED.volume = volume;
		Sound.GHOST_ENTERING_HOUSE.volume = volume;
		Sound.INTRO.volume = volume;
		Sound.POLICE.volume = volume;
		Sound.WAKA.volume = volume;
	},
	
	pauseAll: function() {
		SoundManager.pause(Sound.DEATH);
		SoundManager.pause(Sound.EAT_GHOST);
		SoundManager.pause(Sound.FRIGHTENED);
		SoundManager.pause(Sound.GHOST_ENTERING_HOUSE);
		SoundManager.pause(Sound.INTRO);
		SoundManager.pause(Sound.POLICE);
		SoundManager.pause(Sound.WAKA);
	},
	
	resumeAll: function() {
		SoundManager.resume(Sound.DEATH);
		SoundManager.resume(Sound.EAT_GHOST);
		SoundManager.resume(Sound.FRIGHTENED);
		SoundManager.resume(Sound.GHOST_ENTERING_HOUSE);
		SoundManager.resume(Sound.INTRO);
		SoundManager.resume(Sound.POLICE);
		SoundManager.resume(Sound.WAKA);
	}
};

var Sound = {
	DEATH:					new Audio('sound/Death.wav'),
	EAT_GHOST:				new Audio('sound/EatGhost.wav'),
	FRIGHTENED:				new Audio('sound/FrightenedExtended.ogg'),
	GHOST_ENTERING_HOUSE:	new Audio('sound/GhostEnteringHouseExtended.ogg'),
	INTRO:					new Audio('sound/Intro.wav'),
	POLICE:					new Audio('sound/PoliceExtended.ogg'),
	WAKA:					new Audio('sound/WakaExtended.ogg')
}

SoundManager.init();