

class GameParticle extends Phaser.Sprite {
	

	constructor(game, x, y, key, frame) {
		super(game, x, y, key, frame);
		this.anchor.set(0.5);
		game.physics.enable(this, Phaser.Physics.ARCADE);
	    this.collideWorldBounds = true;
	    this.enableBody = true;
	    this.body.velocity.y = 100;
		game.add.existing(this); 
	}

	update() {
		this.game.debug.body(this);
	}
}

export default GameParticle;