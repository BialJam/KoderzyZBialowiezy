
class Intro extends Phaser.State {

	preload() {
		this.load.audio('music', 'assets/music.mp3');
		this.load.image('logo', 'assets/logo.png')
	}

	create() {
		let music = this.add.audio('music', 0.5, true);
		music.play();

		let logo = this.add.sprite(this.game.world.centerX, -200, 'logo');
		logo.anchor.set(0.5);
		this.physics.enable(logo, Phaser.Physics.ARCADE);
		logo.body.velocity.y = 100;

		let style = { font: "46px Press Start 2P", align: "center", fill: "white" };
		let text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Bede grau w gre", style)
		text.anchor.set(0.5);

	}

}

export default Intro;
