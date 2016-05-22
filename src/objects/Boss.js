

class Boss extends Phaser.Sprite {
	

	constructor(game, x, y, key, frame) {
		super(game, x, y, key, frame);
		this.anchor.set(0.5);
		game.add.existing(this); 


		this.graphics = this.game.add.graphics(8, 8);
	    this.graphics.lineStyle(10, 0xFF0000, 0.8);
	    this.graphics.beginFill(0xFF700B, 1);
		this.graphics.drawRect(2, 2, 310, 111);
		this.graphics.drawRect(10, 10, 100, 100);
		this.graphics.drawRect(this.game.world._width - 220, 2, 200, 111);

		let style2 = { font: "27px Press Start 2P", align: "center", fill: "white" };
		let angrytext = this.game.add.text(216, 45, 'ANGRY    LEVEL:', style2);
		angrytext.anchor.set(0.5);
		let boss = this.game.add.sprite(11, 15, 'boss').scale.set(0.4, 0.4);
		this.graphics.endFill();

		this.angryLevel =  []

		let start = 128;
		for (let i = 0; i < 6; i++) {
			let x = start + (i*30);
			let graphics_single = this.game.add.graphics(8, 8);
			graphics_single.lineStyle(10, 0xC0C0C0, 1);
			graphics_single.beginFill(0xC0C0C0, 0);
			this.angryLevel[i] = graphics_single.drawRect(x, 55, 10, 20);
		}
		this.angryIndex = 0;
	}

	update() {
		//this.game.debug.body(this);
	}

	increaseAngryLevel () {
		this.angryLevel[this.angryIndex++].tint = 0xFF0000;
	}

	dicreaseAngryLevel () {
		this.angryLevel[this.angryIndex--].tint = 0xC0C0C0;
	}
} 

export default Boss;