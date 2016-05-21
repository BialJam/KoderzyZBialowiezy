class DropBox extends Phaser.Sprite {
	constructor(game, x, y) {
		super(game, x, y);
		this.game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.immovable = true;
		this.anchor.set(0.5);
		this.body.setSize(10, 100, 20, -40);

		// var graphics = game.add.graphics(0, 0);
		// graphics.beginFill(0x027a71, 1);
  //   	graphics.lineStyle(4, 0x02fdeb, 10);               
		// graphics.drawRect(0, 0, 500, 70);                
		// graphics.endFill();
		game.add.existing(this); 

	}

	update() {
		this.game.debug.body(this);
	}
}

export default DropBox;