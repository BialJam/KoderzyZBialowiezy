

class DropBox extends Phaser.Sprite {
	

	constructor(game, x, y) {
		super(game, x, y);
		this.game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.immovable = true;
		this.anchor.set(0.5);
		this.body.setSize(10, 100, 20, -40);
		game.add.existing(this); 

	}

	update() {
		//this.game.debug.body(this);
	}
}

export default DropBox;