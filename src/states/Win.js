
class Win extends Phaser.State {

	preload() {
		this.load.audio('music', 'assets/music.mp3');
	}

	create() {
		this.stage.backgroundColor = '#000'
		// music
		this.music = this.add.audio('music', 0.5, true);
		//music.play();
		
		// text
		let style = { font: "70px Press Start 2P", align: "center", fill: "white" };
		let text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 50, 'YOU     WIN', style)
		text.anchor.set(0.5);

		let style2 = { font: "30px Press Start 2P", align: "center", fill: "white" };
		let text2 = this.game.add.text(this.game.world.centerX - 100, this.game.world.centerY + 30, 'PRESS     START \n(SPACE    OR    X)' , style2)

		let space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.game.input.gamepad.start();

    	let pad = this.game.input.gamepad.pad1;
		let buttonX = buttonX = pad.getButton(Phaser.Gamepad.XBOX360_X);
		space.onDown.add(this.end, this);
	}

	end () {
		this.music.stop();
		this.game.state.start('Intro');	
	}
}

export default Win;
