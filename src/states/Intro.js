
class GameState extends Phaser.State {

	preload() {
		this.load.audio('music', 'assets/music.mp3');
		this.load.image('logo', 'assets/logo.png')
	}

	create() {
		let music = this.add.audio('music', 0.5, true);
		music.play();

		let logo = this.add.sprite(600, 400, 'logo');
		this.physics.enable(logo, Phaser.Physics.ARCADE);
		logo.body.velocity.y = 100;
	}

}

export default GameState;
