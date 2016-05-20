class GameState extends Phaser.State {

	preload() {
		this.load.audio('music', 'assets/music.mp3');
	}

	create() {
		let music = this.add.audio('music', 0.5, true);

		music.play();

		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
		let style = { font: "46px Press Start 2P", align: "center", fill: "white" };
		let text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Bede grau w gre", style)
		text.anchor.set(0.5);
	}

}

export default GameState;
