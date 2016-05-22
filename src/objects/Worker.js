
class Worker extends Phaser.Sprite {	

	constructor(game, x, y, key, frame) {
		super(game, x, y, key, frame);
		this.anchor.set(0.5);
		game.physics.enable(this, Phaser.Physics.ARCADE);
	    this.collideWorldBounds = true;
	    this.enableBody = true;
		game.add.existing(this);

		this.animations.add('walk', [27,28,29,30,31,32,33,34,35]);
    	this.animations.play('walk', 20, true);

	}

	stop() {
		this.animations.stop(false, true);
		this.frame = 1;
	}
}

export default Worker;