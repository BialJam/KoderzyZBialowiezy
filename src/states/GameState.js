import RainbowText from 'objects/RainbowText';

class GameState extends Phaser.State {

	preload() {
		this.load.image('background', 'assets/background.jpg');
		this.load.audio('music', 'assets/music.mp3');
	}

	create() {
		this.background = this.game.add.sprite(0, 0, 'background');

		let music = this.add.audio('music', 0.5, true);

		music.play();

		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
		let text = new RainbowText(this.game, center.x, center.y, "- Koderzy z Białowieży -\nkontratakujo!");
		text.anchor.set(0.5);
	}

}

export default GameState;
