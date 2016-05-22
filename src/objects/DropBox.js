

class DropBox extends Phaser.Sprite {

	constructor(game, x, y, key, capacity = 4) {
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

		this.capacity = capacity;

		this.createTweens();
		this.createBar();
	}

	createBar() {
		let bmd = this.game.add.bitmapData(200, 20);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, 200, 40);
		bmd.ctx.fillStyle = '#00685e';
		bmd.ctx.fill();
	    
	    let bglife = this.game.add.sprite(this.position.x, this.position.y - 100, bmd);
	    bglife.anchor.set(0.5);
	    
	    bmd = this.game.add.bitmapData(190, 15);
	    bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, 200, 80);
		bmd.ctx.fillStyle = '#00f910';
		bmd.ctx.fill();
	    
	    this.widthLife = new Phaser.Rectangle(0, 0, 5, bmd.height);
	    this.totalLife = bmd.width;
	    
	    this.life = this.game.add.sprite(this.position.x - bglife.width/2 + 5, this.position.y - 100, bmd);
	    this.life.anchor.y = 0.5;
	    this.life.cropEnabled = true;
	    this.life.crop(this.widthLife);
	}

	updateBar() {
	    if(this.widthLife.width <= 0){
	      this.widthLife.width = this.totalLife;
	    }
	    else{
	    	let width = this.group.length * (this.totalLife / this.capacity);
	    	if (width == 0)
	    		width += 5;
	      	this.game.add.tween(this.widthLife).to( { width: width }, 200, Phaser.Easing.Linear.None, true);
	    }
	}

	update() {
		this.game.debug.body(this);
		this.life.updateCrop();
	}

	addC(obj) {
		this.group.add(obj);
		this.updateBar();
	}

	updateCapacity(capacity) {
		this.capacity = capacity;
		this.updateBar();
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
		this.updateBar();
		this.onBoxClear.dispatch(this);
	}

	clearBox() {
		this.moveOutsideTween.start();
		this.moveGroupOutsideTween.start();
	}
}

export default DropBox;