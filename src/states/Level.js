import GameParticle from 'objects/GameParticle'
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

	create() {
		// music
		this.music = this.add.audio('music', 0.5, true);
		this.music.play();

		// set background color
		this.stage.backgroundColor = '#c0c0c0'
		
		this.dumpBox = this.add.sprite(this.game.world.centerX, this.game.world.centerY, "junk");
		this.dumpBox.anchor.set(0.5);
		this.game.physics.enable(this.dumpBox, Phaser.Physics.ARCADE);
		this.dumpBox.body.immovable = true;

		this.particleGroup = this.game.add.group();
	}

	generateParticle() {
		let rand = this.getRandomNumber(this.itemsCount);
		let type = this.itemsMap[rand];
		let item = new GameParticle(this.game, this.game.world.centerX, -this.itemSize, type);
		this.particleGroup.add(item);
	}

	collision(obj1, obj2) {
		this.missed++;
		obj2.kill();
		// obj1.destroy();
	}

	update() {
		this.time++;

		if (Phaser.Utils.chanceRoll(1)) {
			this.generateParticle();
		}

		this.game.physics.arcade.overlap(this.particleGroup, this.dumpBox, this.collision, null, this);

		// check if user missed to many items
		if (this.missed >= this.availbleMisses) {
			this.music.stop();
			this.game.state.start('Intro');
		}

		//button clicked
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

			// check if match
			// let match = this.outOfBorderIndex(this.border);
			if(match == undefined)
				return;

			// check button


		}
	}

	getRandomNumber(size, start=0) {
		return Math.floor((Math.random()*size) + start);
	}
}

export default Level;
