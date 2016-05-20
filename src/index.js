import Intro from 'states/Intro';

class Game extends Phaser.Game {

	constructor() {
		super(1280, 720, Phaser.AUTO, 'content', null);
		this.state.add('Intro', Intro, false);
		this.state.start('Intro');
	}

}

new Game();
