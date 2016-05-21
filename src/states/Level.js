
class Level extends Phaser.State {

	preload() {
		this.load.audio('music', 'assets/music.mp3');
		this.itemsCount = 4;
		for(let i = 1; i < 5; i++) {
			name = 'item' + i.toString();
			this.load.image(name, 'assets/' + name + '.jpg');
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
		let music = this.add.audio('music', 0.5, true);
		//music.play();

		// set background color
		this.stage.backgroundColor = '#c0c0c0'
		
		// items
		this.items = []
		for(let i = 0; i < 10; i++) {
			let item = this.add.sprite(this.game.world.centerX - this.itemSize, -this.itemSize, 'item' + this.getRandomNumber(this.itemsCount, 1).toString());
			item.anchor.set(0.5);
			this.physics.enable(item, Phaser.Physics.ARCADE);
			item.body.velocity.y = 0;
			this.items.push(item);
		}
	}

	update() {
		this.time++;

		this.nextItem();

		// check if something missed
		let missedIndex = this.outOfBorderIndex(this.game.world._height);
		if(missedIndex != undefined) {
			this.playMissedSound(missedIndex);
			this.stopItem(missedIndex);
			this.missed++;
		}

		// check if user missed to many items
		if (this.missed >= this.availbleMisses) {
			// end game
		}

		//button clicked
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

			// check if match
			let match = this.outOfBorderIndex(this.border);
			if(match == undefined)
				return;

			// check button


		}
	}

	outOfBorderIndex (border) {
		let index = undefined;
		for(let i = 0; i < this.items.length; i++) {
			if(this.items[i].y > border) {
				index = i;
				break;
			}
		}
		return index;
	}

	moveItem(itemIndex) {
		this.items[itemIndex].body.velocity.y = this.speed;
		this.lastTime = this.time;
	}

	stopItem(itemIndex) {
		console.log(itemIndex);
		this.items[itemIndex].body.velocity.y = 0;
		this.items[itemIndex].y = -this.itemSize;
	}

	getRandomNumber(size, start=0) {
		return Math.floor((Math.random()*size) + start);
	}

	playMissedSound(itemIndex) {
		// TO-DO
	}

	nextItem() {
		if(this.getRandomNumber(10)) {
			return;
		}
		if (this.lastTime + this.itemSize > this.time) {
			return;
		}
		let index = this.getRandomNumber(this.items.length, 0);
		if (this.items[index].body.velocity.y != 0) {
			return;
		}
		this.moveItem(index);
	}
}

export default Level;
