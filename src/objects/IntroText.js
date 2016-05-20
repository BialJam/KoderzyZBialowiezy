class IntroText extends Phaser.Text {

	constructor(game, x, y, text) {
		super(game, x, y, text, { font: "46px Press Start 2P", align: "center" });
		this.game.stage.addChild(this);
	}
}

export default IntroText;