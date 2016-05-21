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

	create() {
		// music
		this.music = this.add.audio('music', 0.5, true);
		this.music.play();

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
		this.boxGroup = this.game.add.group();
	}

	generateParticle() {
		let rand = this.getRandomNumber(this.itemsCount);
		let type = this.itemsMap[rand];
		let item = new GameParticle(this.game, this.game.world.centerX, -this.itemSize);
		this.particleGroup.add(item);
	}

	collision(obj1, obj2) {
		this.missed++;
		this.particleGroup.remove(obj2);
	}

	caught(catchZone, obj) {
		this.group.remove(obj);
		this.destGroup.add(obj);
		obj.body.velocity.y = 0;
		obj.body.velocity.x = this.direction * 80;
	}

	inOkBox(box, obj) {
		obj.body.velocity.x = 0;
	}

	inBadBox(box, obj) {
		obj.body.velocity.x = 0;	
	}

	update() {
		this.time++;

		if (Phaser.Utils.chanceRoll(1)) {
			this.generateParticle();
		}

		this.game.physics.arcade.overlap(this.particleGroup, this.dumpBox, this.collision, null, this);
		this.game.physics.arcade.overlap(this.boxGroup, this.okBox, this.inOkBox, null, this);
		this.game.physics.arcade.overlap(this.boxGroup, this.badBox, this.inBadBox, null, this);

		// check if user missed to many items
		if (this.missed >= this.availbleMisses) {
			this.music.stop();
			this.game.state.start('Intro');
		}

		//button clicked
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			// check if match
			let direction = 1;
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
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
