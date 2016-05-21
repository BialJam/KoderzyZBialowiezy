import GameParticle from 'objects/GameParticle'
import DumpSprite from 'objects/DumpSprite'
import DropBox from 'objects/DropBox'

class Level extends Phaser.State {

	init() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    }

	preload() {

		this.itemsMap = ['watermelon', 'apple', 'bread', 'junk'];
		this.badItems = ['watermelon', 'apple'];
		this.goodItems = ['bread', 'junk'];

		this.load.audio('music', 'assets/music.mp3');
		this.load.image('trash', 'assets/trash-icon.png');
		this.itemsCount = 4;
		for(let i = 1; i < 5; i++) {
			name = this.itemsMap[i-1];
			this.load.image(name, 'assets/item' + i.toString() + '.jpg');
		}
		this.itemSize = 40;
		this.speed = 50;
		this.time = 0
		this.border = this.game.world._height - 40;
		this.missed = 0;
		this.availbleMisses = 6;
		this.lastTime = 0;
		this.level = 0;
	}

	catchLeft() {
		this.game.physics.arcade.overlap(this.particleGroup, this.catchZone, this.caught, null, {
			direction: -1,
			group: this.particleGroup,
			destGroup: this.flyGroup,
			game: this.game,
			this: this,
		});
	}

	catchRight() {
		this.game.physics.arcade.overlap(this.particleGroup, this.catchZone, this.caught, null, {
			direction: 1,
			group: this.particleGroup,
			destGroup: this.flyGroup,
			game: this.game,
			this: this,
		});
	}

	clearOkBox() {
		this.okBoxGroup.removeAll();
		this.generateCurrentItemRequest();
		if (this.okBoxGroup.length != this.currentItem.count) {
			this.missed++;
		}
	}

	clearBadBox() {
		this.badBoxGroup.removeAll();
		if (this.badBoxGroup.length < 4) {
			this.missed++;
		}
	}

	create() {
		// music
		this.music = this.add.audio('music', 0.5, true);
		// this.music.play();
		this.timer = this.game.time.create(false);
		this.timer.loop(20000, this.updateCounter, this);
		// this.timer.start();

		let leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		let rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

		let aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		let dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

		leftKey.onDown.add(this.catchLeft, this);
		rightKey.onDown.add(this.catchRight, this);

		aKey.onDown.add(this.clearBadBox, this);
		dKey.onDown.add(this.clearOkBox, this);

		// set background color
		this.stage.backgroundColor = '#c0c0c0'

		this.dumpBox = new DumpSprite(this.game, this.game.world.centerX, this.game.world.centerY);
		this.dumpBox.body.setSize(220, 10, -90, 0);

		this.catchZone = new DumpSprite(this.game, this.game.world.centerX, this.game.world.centerY - 50);

		this.okBox = new DropBox(this.game, this.game.world.centerX + 100, this.game.world.centerY - 50);
		this.badBox = new DropBox(this.game, this.game.world.centerX - 120, this.game.world.centerY - 50);

		this.particleGroup = this.game.add.group();
		this.flyGroup = this.game.add.group();
		this.flewOverGroup = this.game.add.group();

		this.okBoxGroup = this.game.add.group();
		this.badBoxGroup = this.game.add.group();

		//let trash = this.game.add.sprite(140, 40, 'trash');
		//trash.scale.setTo(0.2, 0.2);
		let style = { font: "32px Press Start 2P", align: "center", fill: "white" };
		this.addStaticText(style);
		this.trashCountText = this.game.add.text(270, 40, '0' , style)
		this.itemsCountText = this.game.add.text(this.game.world._width - 75, 45, '', style)
		this.trashCountText.anchor.set(0.5);
		this.itemsCountText.anchor.set(0.5);
		this.generateCurrentItemRequest();

		this.lastTime = this.game.time.now;

		this.timer = 0;
	}

	addStaticText(style) {
		let trashText = this.game.add.text(140, 40, 'TRASH    ITEMS:' , style)
		trashText.anchor.set(0.5);
	}

	updateText() {
		this.trashCountText.setText(this.badBoxGroup.length.toString());
		let count = this.currentItem.count - this.okBoxGroup.length;
		this.itemsCountText.setText('x  ' + count.toString());
	}

	updateCounter() {
		if(this.missed > 0) {
			this.missed--;
		}
		this.speed += 50;
		this.level += 1
	}

	generateParticle() {
		let rand = this.getRandomNumber(this.itemsCount);
		let type = this.itemsMap[rand];
		let item = new GameParticle(this.game, this.game.world.centerX, -this.itemSizem, type);
		// item.body.velocity.y = this.speed;
		this.particleGroup.add(item);
	}

	generateCurrentItemRequest() {
		let rand = this.getRandomNumber(this.goodItems.length);
		let type = this.goodItems[rand];
		let count = this.getRandomNumber(6, 1);
		this.game.add.sprite(this.game.world._width - 150, 20, type);
		this.currentItem = {
			type: type,
			count: count
		};
		this.updateText();
	}

	collision(obj1, obj2) {
		if (!(this.goodItems.indexOf(obj2.key) > -1 && obj2.key != this.currentItem.type)) {
			this.missed++;
		}
		this.particleGroup.remove(obj2);
	}

	caught(catchZone, obj) {
		this.group.remove(obj);
		this.destGroup.add(obj);
		obj.body.velocity.y = 0;
		obj.body.velocity.x = this.direction * 80;
		this.game.add.tween(obj).to( { angle: 45 }, 1000, Phaser.Easing.Linear.None, true, 250);
    	this.game.add.tween(obj.scale).to( { x: 0.5, y: 0.5 }, 1000, Phaser.Easing.Linear.None, true, 250);
		this.this.updateText();
	}

	inOkBox(box, obj) {
		this.flyGroup.remove(obj);
		if(this.okBoxGroup.length >= this.currentItem.count || obj.key != this.currentItem.type) {
			this.flewOverGroup.add(obj);
			this.missed++;
		} else {
			obj.body.velocity.x = 0;
			this.okBoxGroup.add(obj);
		}
	}

	inBadBox(box, obj) {
		this.flyGroup.remove(obj);
		if(this.badBoxGroup.length >= 4) {
			this.flewOverGroup.add(obj);
			this.missed++;
		} else if (this.goodItems.indexOf(obj.key) > -1) {
			this.missed++;
		} 
		else {
			obj.body.velocity.x = 0;
			this.badBoxGroup.add(obj);
		}
	}

	update() {
		//alert(this.timer.duration);

		this.timer += this.game.time.elapsed;

		if (this.timer > 1000) {
			this.timer = 0;
			if (Phaser.Utils.chanceRoll(30)) {
				this.generateParticle();
				this.lastTime = this.timer;
			}
		}

		this.game.physics.arcade.overlap(this.particleGroup, this.dumpBox, this.collision, null, this);
		this.game.physics.arcade.overlap(this.flyGroup, this.okBox, this.inOkBox, null, this);
		this.game.physics.arcade.overlap(this.flyGroup, this.badBox, this.inBadBox, null, this);

		// check if user missed to many items
		if (this.missed >= this.availbleMisses) {
			this.music.stop();
			this.game.state.start('Level');
		}

		/*
		let rightStickX = false;
		let rightStickY = false;
		
	    if (this.pad1.connected)
	    {
	        rightStickX = this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
	        rightStickY = this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);
	    }
	    */
		//button clicked 
	}

	getRandomNumber(size, start=0) {
		return Math.floor((Math.random()*size) + start);
	}
}

export default Level;
