import Worker from 'objects/Worker'

class Lose extends Phaser.State {

	preload() {
		this.load.audio('music', 'assets/game_over.mp3');
		this.load.spritesheet('character', 'assets/professor_walk.png', 64, 64, 36);
	}

	create() {
		this.stage.backgroundColor = '#000'
		// music
		this.music = this.add.audio('music', 0.3, true);
		this.music.play();
		
		// text
		let style = { font: "70px Press Start 2P", align: "center", fill: "white" };
		let text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 50, 'YOU     LOSE', style)
		text.anchor.set(0.5);

		let style2 = { font: "30px Press Start 2P", align: "center", fill: "white" };
		let text2 = this.game.add.text(this.game.world.centerX - 100, this.game.world.centerY + 30, 'PRESS     START \n(SPACE    OR    X)' , style2)

		let space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.game.input.gamepad.start();

    	let pad = this.game.input.gamepad.pad1;
		let buttonX = pad.getButton(Phaser.Gamepad.XBOX360_A);
		space.onDown.add(this.end, this);
		if(buttonX)
			buttonX.onDown.add(this.end, this);

		this.worker = new Worker(this.game, this.game.world.centerX, this.game.world.centerY, 'character');
		this.worker.animations.play('walk', 15, true);
		let tween = this.game.add.tween(this.worker).to({ x: this.game.world.width + 20 }, 2500, Phaser.Linear, true, 200);
	}

	end () {
		this.music.stop();
		this.game.state.start('Intro');	
	}
}

export default Lose;
