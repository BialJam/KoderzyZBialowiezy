import GameParticle from 'objects/GameParticle'
import DumpSprite from 'objects/DumpSprite'

class Level extends Phaser.State {

	init() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    }

	preload() {

		this.itemsMap = ['watermelon', 'apple', 'bread', 'junk'];

		this.load.audio('music', 'assets/music.mp3');
		this.itemsCount = 4;
		for(let i = 1; i < 5; i++) {
			name = this.itemsMap[i];
			this.load.image(name, 'assets/item' + i.toString() + '.jpg');
		}
		this.itemSize = 40;
		this.speed = 200;
		this.time = 0
		this.border = this.game.world._height - 40;
		this.missed = 0;
		this.availbleMisses = 3;
		this.lastTime = 0;
	}

	catchLeft() {
		this.game.physics.arcade.overlap(this.particleGroup, this.catchZone, this.caught, null, {
			direction: -1,
			group: this.particleGroup,
			destGroup: this.flyGroup,
			game: this.game
		});
	}

	catchRight() {
		this.game.physics.arcade.overlap(this.particleGroup, this.catchZone, this.caught, null, {
			direction: 1,
			group: this.particleGroup,
			destGroup: this.flyGroup,
			game: this.game
		});
	}

	clearOkBox() {
		this.okBoxGroup.removeAll()
	}

	clearBadBox() {
		this.badBoxGroup.removeAll()
	}

	create() {
		// music
		this.music = this.add.audio('music', 0.5, true);
		//this.music.play();

		// gamepad
		/*
		this.game.input.gamepad.start();
    	this.pad1 = this.game.input.gamepad.pad1;
		*/
		
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

		this.okBox = new DumpSprite(this.game, this.game.world.centerX + 100, this.game.world.centerY - 50);
		this.okBox.body.setSize(10, 100, 20, -40);

		this.badBox = new DumpSprite(this.game, this.game.world.centerX - 100, this.game.world.centerY - 50);
		this.badBox.body.setSize(10, 100, 0, -40);

		this.particleGroup = this.game.add.group();
		this.flyGroup = this.game.add.group();
		this.flewOverGroup = this.game.add.group();

		this.okBoxGroup = this.game.add.group();
		this.badBoxGroup = this.game.add.group();
	}

	generateParticle() {
		let rand = this.getRandomNumber(this.itemsCount);
		let type = this.itemsMap[rand];
		let item = new GameParticle(this.game, this.game.world.centerX, -this.itemSizem, type);
		item.body.velocity.y = this.speed;
		this.particleGroup.add(item);
	}

	collision(obj1, obj2) {
		console.log(obj2.type);
		this.missed++;
		this.particleGroup.remove(obj2);
	}

	caught(catchZone, obj) {
		this.group.remove(obj);
		this.destGroup.add(obj);
		obj.body.velocity.y = 0;
		obj.body.velocity.x = this.direction * 80;

		this.game.add.tween(obj).to( { angle: 45 }, 1000, Phaser.Easing.Linear.None, true, 250);
    	this.game.add.tween(obj.scale).to( { x: 0.5, y: 0.5 }, 1000, Phaser.Easing.Linear.None, true, 250);
	}

	inOkBox(box, obj) {
		this.flyGroup.remove(obj);
		if(this.okBoxGroup.length >= 3) {
			this.flewOverGroup.add(obj);
		} else {
			obj.body.velocity.x = 0;
			this.okBoxGroup.add(obj);
		}
	}

	inBadBox(box, obj) {
		this.flyGroup.remove(obj);
		if(this.badBoxGroup.length >= 3) {
			this.flewOverGroup.add(obj);
		} else {
			obj.body.velocity.x = 0;
			this.badBoxGroup.add(obj);
		}
	}

	update() {
		this.time++;

		if (Phaser.Utils.chanceRoll(1)) {
			this.generateParticle();
		}

		this.game.physics.arcade.overlap(this.particleGroup, this.dumpBox, this.collision, null, this);
		this.game.physics.arcade.overlap(this.flyGroup, this.okBox, this.inOkBox, null, this);
		this.game.physics.arcade.overlap(this.flyGroup, this.badBox, this.inBadBox, null, this);

		// check if user missed to many items
		if (this.missed >= this.availbleMisses) {
			this.music.stop();
			this.game.state.start('Intro');
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
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) /*|| rightStickY || rightStickX*/) {
			// check if match
			let direction = 1;
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) /*|| rightStickY*/) {
				direction = -1;
			}
			let gotBox = this.game.physics.arcade.overlap(this.particleGroup, this.catchZone, this.caught, null, {
				direction: direction,
				group: this.particleGroup,
				destGroup: this.boxGroup
			});
		}
	}

	getRandomNumber(size, start=0) {
		return Math.floor((Math.random()*size) + start);
	}
}

export default Level;
