

class DropBox extends Phaser.Sprite {

	constructor(game, x, y, key) {
		super(game, x, y, key);
		this.game.physics.enable(this, Phaser.Physics.ARCADE);
		this.anchor.set(0.5);
		if(key == 'trash') {
			this.body.setSize(10, 100, 50, 40);
		} else {
			this.body.setSize(10, 100, 130, 40);
		}
		game.add.existing(this); 
		this.group = game.add.group();

		this.onBoxClear = new Phaser.Signal();

		this.createTweens();
	}

	update() {
		this.game.debug.body(this);
	}

	addC(obj) {
		this.group.add(obj);
	}

	createTweens() {
		let spriteY = this.position.y;
		let groupY = this.group.position.y;
		this.moveOutsideTween = this.game.add.tween(this).to({y: spriteY + 400}, 300, Phaser.Easing.Quadratic.InOut);
		let tweenC = this.game.add.tween(this).to({y: spriteY}, 300, Phaser.Easing.Quadratic.InOut);
		this.moveGroupOutsideTween = this.game.add.tween(this.group).to({y: groupY + 400}, 300, Phaser.Easing.Quadratic.InOut);
		let tweenD = this.game.add.tween(this.group).to({y: groupY}, 300, Phaser.Easing.Quadratic.InOut);
		this.moveOutsideTween.chain(tweenC);
		this.moveGroupOutsideTween.chain(tweenD);
		this.moveGroupOutsideTween.onComplete.add(this.onTweenComplete, this);
	}

	onTweenComplete() {
		this.group.removeAll();
		this.onBoxClear.dispatch(this);
	}

	clearBox() {
		this.moveOutsideTween.start();
		this.moveGroupOutsideTween.start();
	}
}

export default DropBox;