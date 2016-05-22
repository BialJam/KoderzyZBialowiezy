import Worker from 'objects/Worker'

class Win extends Phaser.State {

	preload() {
		this.load.audio('music', 'assets/music.mp3');
		this.load.image("boss", "assets/boss_cut.png")
		this.load.spritesheet('character', 'assets/professor_walk.png', 64, 64, 36);
	}

	create() {
		this.stage.backgroundColor = '#000'
		// music
		this.music = this.add.audio('music', 0.3, true);
		this.music.play();

		this.worker = new Worker(this.game, this.game.world.centerX - 5, this.game.world.centerY, 'character');
		this.worker.alpha = 0;

		this.bossSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 200, 'boss');
	    this.bossSprite.anchor.setTo(0.5);
	    this.bossSprite.alpha = 0;

	    this.game.add.tween(this.bossSprite).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0);
	    let tween = this.game.add.tween(this.worker).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0);

	    tween.onComplete.add(this.onFadeInComplete, this);
	}

	end () {
		this.music.stop();
		this.game.state.start('Intro');	
	}

	onFadeInComplete() {

		let message = "Boss:    You    have    completed    your    challenge,    now    you    are    the    boss."
		let style = { font: "30px Press Start 2P", align: "left", fill: "white" };
	
		this.textObject = this.game.add.text(150, this.game.world.centerY + 200, "", style);

    	let timerEvent = this.game.time.events.repeat(100, message.replace(/    /g, " ").length, this.displayNextLetter, 
                                { textObject: this.textObject, message: message, counter: 1 });

    	timerEvent.timer.onComplete.addOnce(this.onTextComplete, this);
	}

	onTextComplete() {
		let tween = this.game.add.tween(this.bossSprite).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true, 0);
		tween.onComplete.add(this.onFadeOutComplete, this);
	}

	onFadeOutComplete() {
		// text
		let style = { font: "70px Press Start 2P", align: "center", fill: "white" };
		let text = this.game.add.text(this.game.world.centerX, 150, 'YOU     WIN', style)
		text.anchor.set(0.5);
		text.alpha = 0;

		let style2 = { font: "30px Press Start 2P", align: "center", fill: "white" };
		let text2 = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 130, 'PRESS     START \n(SPACE    OR    X)' , style2)
		text2.anchor.set(0.5);
		text2.alpha = 0;

		this.game.add.tween(text2).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 0);
		this.game.add.tween(text).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 0);

		this.worker.frame = 19;

		let space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.game.input.gamepad.start();

    	let pad = this.game.input.gamepad.pad1;
		let buttonX = pad.getButton(Phaser.Gamepad.XBOX360_A);
		space.onDown.add(this.end, this);
		if (buttonX)
			buttonX.onDown.add(this.end, this);
	}


	displayNextLetter() {
		if(this.message[this.counter] == " ")
			this.counter += 3;

	    this.textObject.text = this.message.substr(0, this.counter);
	    this.counter += 1;
	}
}

export default Win;
