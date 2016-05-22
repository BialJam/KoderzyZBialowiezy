import GameParticle from 'objects/GameParticle'
import DumpSprite from 'objects/DumpSprite'
import DropBox from 'objects/DropBox'
import Boss from 'objects/Boss'

class Level extends Phaser.State {

	init() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    }

	preload() {

		this.itemsMap = ['shit', 'used_condom', 'bomb', 'glock','brick', 'water_melon', 'banana', 'cola', 'durex', 'oreo', 'snickers'];
		this.badItems = ['shit', 'used_condom', 'bomb', 'glock', 'brick'];
		this.goodItems = ['water_melon', 'banana', 'cola', 'durex', 'oreo', 'snickers'];

		this.load.audio('music', 'assets/soundtrack_music.mp3');
		this.load.image('background', 'assets/background.png');
		this.load.image('line', 'assets/line.png');
		this.load.image('trash', 'assets/trash.png');
		this.load.image('box', 'assets/box.png');
		this.load.image('boss', 'assets/boss.gif');

		this.load.audio('point', 'assets/Collect_Point_00.mp3');
		this.load.audio('craft', 'assets/Craft_00.mp3');
		this.load.audio('death', 'assets/Hero_Death_00.mp3');
		this.load.audio('level', 'assets/Jingle_Achievement_00.mp3');
		this.load.audio('move', 'assets/Jump_00.mp3');
		this.load.audio('wrong_move', 'assets/Explosion_03.mp3');
		this.itemsCount = this.itemsMap.length;
		for(var item in this.itemsMap) {
			var name = this.itemsMap[item];
			this.load.image(name, 'assets/' + name + '.png');
		}
		this.itemSize = 100;
		this.speed = 140;
		this.time = 0
		this.border = this.game.world._height - 40;
		this.missed = 0;
		this.availbleMisses = 6;
		this.level = 0;
		
	}

	create() {
		this.itemsToNextLevel = 30;
		this.game.input.gamepad.start();
		this.pad = this.game.input.gamepad.pad1;
		// sprites
		this.game.add.sprite(0, 0, 'background');
		this.game.add.sprite(this.game.world.centerX-70, 0, 'line');
		// this.game.add.sprite(this.game.world.centerX+100, this.game.world._height - 190, 'box');
		// this.game.add.sprite(this.game.world.centerX-280, this.game.world._height - 190, 'trash');
		
		// music
		this.music = this.add.audio('music', 0.2, true);
		this.music.play();

		// keys
		let leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		let rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

		let aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		let dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);	

		this.pad.addCallbacks(this, { onConnect: function () {
			let rect = this.pad.getButton(Phaser.Gamepad.XBOX360_X);
    		let circ = this.pad.getButton(Phaser.Gamepad.XBOX360_B);
			rect.onDown.add(this.clearBadBox, this);
    		circ.onDown.add(this.clearOkBox, this);
		} });


		leftKey.onDown.add(this.catchLeft, this);
		rightKey.onDown.add(this.catchRight, this);

		aKey.onDown.add(this.clearBadBox, this);
		dKey.onDown.add(this.clearOkBox, this);


		// collisions
		this.dumpBox = new DumpSprite(this.game, this.game.world.centerX, this.game.world._height + 100);
		this.dumpBox.body.setSize(220, 10, -90, 0);

		this.catchZone = new DumpSprite(this.game, this.game.world.centerX, this.game.world._height - 100);

		this.okBox = new DropBox(this.game, this.game.world.centerX + 200, this.game.world._height - 100, 'box');
		this.badBox = new DropBox(this.game, this.game.world.centerX - 220, this.game.world._height - 100, 'trash');

		this.okBox.onBoxClear.add(this.updateText, this);
		this.badBox.onBoxClear.add(this.updateText, this);

		this.particleGroup = this.game.add.group();
		this.flyGroup = this.game.add.group();
		this.flewOverGroup = this.game.add.group();
		this.boss = new Boss(this.game, 0, 8);
		// items counter and texts
		let style = { font: "32px Press Start 2P", align: "center", fill: "white" };
		this.addStaticText(style);
		this.itemsCountText = this.game.add.text(this.game.world._width - 55, 82, '', style)
		this.levelText = this.game.add.text(this.game.world._width - 50, 22, '0', style)
		this.itemsCountText.anchor.set(0.5);
		this.generateCurrentItemRequest();

		// timers
		this.timerCounter = 0;

		this.pointSound = this.add.audio('point');
		this.craftSound = this.add.audio('craft');
		this.deathSound = this.add.audio('death');
		this.levelSound = this.add.audio('level');
		this.moveSound = this.add.audio('move');
		this.wrongMoveSound = this.add.audio('wrong_move');

	}

	update() {
		// item generator
		this.timerCounter += this.game.time.elapsed;
		if (this.timerCounter > 1000 && this.itemsToNextLevel > 0) {
			this.timerCounter = 0;
			let chanceNormal = Phaser.Utils.chanceRoll(40);
			let chanceCurrent = Phaser.Utils.chanceRoll(30);
			if (chanceNormal) {
				this.generateParticle();
			} else if (chanceCurrent) {
				this.generateParticle(this.currentItem.type);
			}
		}

		// define overlaps
		this.game.physics.arcade.overlap(this.particleGroup, this.dumpBox, this.collision, null, this);
		this.game.physics.arcade.overlap(this.flyGroup, this.okBox, this.inOkBox, null, this);
		this.game.physics.arcade.overlap(this.flyGroup, this.badBox, this.inBadBox, null, this);

		// check if user missed to many items
		if (this.missed >= this.availbleMisses) {
			this.music.stop();
			this.game.state.start('Lose');
		}
	}



	// texts and state update functions  

	addStaticText(style) {
		let levelText = this.game.add.text(this.game.world._width - 105, 40, 'LEVEL:' , style)
		levelText.anchor.set(0.5);
	}

	updateText() {
		let count = this.currentItem.count - this.okBox.group.length;
		this.itemsCountText.setText('x  ' + count.toString());
	}

	updateCounter() {
		this.levelSound.play();
		if(this.level == 2) {
			this.music.stop();
			this.game.state.start('Win');
		}
		if(this.missed > 0) {
			this.missed--;
			this.boss.dicreaseAngryLevel();
		}
		this.speed += 50;
		this.level += 1
		this.levelText.setText(this.level);
		this.itemsToNextLevel = 30;
	}


	// generate some data functions

	generateParticle(type = null) {
		if (!type) {
			let rand = this.getRandomNumber(this.itemsCount);
			type = this.itemsMap[rand];
		}
		let item = new GameParticle(this.game, this.game.world.centerX, -this.itemSize, type);
		item.body.velocity.y = this.speed;
		this.particleGroup.add(item);
		this.itemsToNextLevel--;
	}

	generateCurrentItemRequest() {
		if (this.currentItem) {
			this.currentItem.item.destroy();
		}
		
		let rand = this.getRandomNumber(this.goodItems.length);
		let type = this.goodItems[rand];
		let count = this.getRandomNumber(6, 1);
		this.okBox.updateCapacity(count);
		this.currentItem = {
			type: type,
			count: count,
			item: this.game.add.sprite(this.game.world._width - 150, 50, type)
		};
		this.currentItem.item.scale.setTo(0.6,0.6);
		this.updateText();
	}

	getRandomNumber(size, start=0) {
		return Math.floor((Math.random()*size) + start);
	} 



	// collisions functions 

	collision(obj1, obj2) {
		if (!(this.goodItems.indexOf(obj2.key) > -1 && obj2.key != this.currentItem.type)) {
			this.missed++;
			this.boss.increaseAngryLevel();
		}
		this.particleGroup.remove(obj2);
		this.checkNextLevel();
	}

	checkNextLevel() {
		if(this.particleGroup.length == 0 && this.itemsToNextLevel <= 0) {
			this.updateCounter();
		}
	}

	caught(catchZone, obj) {
		this.group.remove(obj);
		this.destGroup.add(obj);
		obj.body.velocity.y = 0;
		obj.body.velocity.x = this.direction * 300;
		this.game.add.tween(obj).to( { angle: 90 }, 1500, Phaser.Easing.Linear.None, true, 500);
    	this.this.checkNextLevel();
	}

	inOkBox(box, obj) {
		this.flyGroup.remove(obj);
		if(this.okBox.group.length >= this.currentItem.count || obj.key != this.currentItem.type) {
			this.flewOverGroup.add(obj);
			this.deathSound.play();
			this.missed++;
			this.boss.increaseAngryLevel();
		} else {
			obj.body.velocity.x = 0;
			this.okBox.addC(obj);
			this.pointSound.play();
			this.game.add.tween(obj.scale).to( { x: 0.5, y: 0.5 }, 1500, Phaser.Easing.Linear.None, true);
		}
		this.updateText();
	}

	inBadBox(box, obj) {
		this.flyGroup.remove(obj);
		if(this.badBox.group.length >= 4) {
			this.flewOverGroup.add(obj);
			this.deathSound.play();
			this.missed++;
			this.boss.increaseAngryLevel();
		}
		else {
			obj.body.velocity.x = 0;
			this.badBox.addC(obj);
			this.craftSound.play();
			this.game.add.tween(obj.scale).to( { x: 0.5, y: 0.5 }, 1500, Phaser.Easing.Linear.None, true);
			if (this.goodItems.indexOf(obj.key) > -1) {
				this.missed++;
				this.boss.increaseAngryLevel();
			}
		}
		this.updateText();
	}


	// keys actions

	catchLeft() {
		let ret = this.game.physics.arcade.overlap(this.particleGroup, this.catchZone, this.caught, null, {
			direction: -1,
			group: this.particleGroup,
			destGroup: this.flyGroup,
			game: this.game,
			this: this,
		});
		if (!ret) {
			// this.craftSound.play();
		}
	}

	catchRight() {
		let ret = this.game.physics.arcade.overlap(this.particleGroup, this.catchZone, this.caught, null, {
			direction: 1,
			group: this.particleGroup,
			destGroup: this.flyGroup,
			game: this.game,
			this: this,
		});
		if (!ret) {
			// this.craftSound.play();
		}
	}

	clearOkBox() {
		this.generateCurrentItemRequest();
		if (this.okBox.group.length != this.currentItem.count) {
			this.missed++;
			this.boss.increaseAngryLevel();
			this.wrongMoveSound.play();
		} else {
			this.moveSound.play();
		}
		this.okBox.clearBox();
	}

	clearBadBox() {
		if (this.badBox.group.length < 4) {
			this.missed++;
			this.boss.increaseAngryLevel();
			this.wrongMoveSound.play();
		} else { 
			this.moveSound.play();
		}
		this.badBox.clearBox();
	}
}

export default Level;
