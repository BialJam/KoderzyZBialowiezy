import Worker from 'objects/Worker'

class Preview extends Phaser.State {

	preload() {
		this.load.audio('music', 'assets/music.mp3');
		this.load.image("boss", "assets/boss_cut.png")
		this.load.spritesheet('character', 'assets/professor_walk.png', 64, 64, 36);
	}

	create() {
		// music
		this.music = this.add.audio('music', 0.5, true);
		this.music.play();
		this.worker = new Worker(this.game, 10, this.game.world.centerY, 'character');
		this.worker.animations.play('walk', 20, true);
		let tween = this.game.add.tween(this.worker).to({ x: this.game.world.centerX - 5 }, 2500, Phaser.Linear, true);
		tween.onComplete.add(this.onWalkComplete, this);

		this.bossSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 200, 'boss');
	    this.bossSprite.anchor.setTo(0.5);
	    this.bossSprite.alpha = 0;

	    this.game.add.tween(this.bossSprite).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0);
	}

	onWalkComplete() {
		this.worker.stop();

		let message = "You:    I    am    looking    for    a    job.    I    am    skilled    HTML    programmer.\n\
					   Boss:    I    think    I    have    a    proper    job    for    you.    Follow    me."
		let style = { font: "30px Press Start 2P", align: "left", fill: "white" };
	
		this.textObject = this.game.add.text(200, this.game.world.centerY + 200, "", style);

    	let timerEvent = this.game.time.events.repeat(100, message.replace(/    /g, " ").length, this.displayNextLetter, 
                                { textObject: this.textObject, message: message, counter: 1 });

    	timerEvent.timer.onComplete.addOnce(this.onTextComplete, this);
	}

	onTextComplete() {
		this.game.add.tween(this.bossSprite).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true, 0);
		this.game.add.tween(this.worker).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true, 0);
		let tween = this.game.add.tween(this.textObject).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true, 0);
		tween.onComplete.add(this.onFadeOutComplete, this);
	}

	onFadeOutComplete() {
		this.music.stop();
		this.state.start('Level');
	}

	displayNextLetter() {
		if(this.message[this.counter] == " ")
			this.counter += 3;

	    this.textObject.text = this.message.substr(0, this.counter);
	    this.counter += 1;
	}
}

export default Preview;