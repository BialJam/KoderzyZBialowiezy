import Intro from 'states/Intro';
import Preview from 'states/Preview';
import Level from 'states/Level'

class Game extends Phaser.Game {

	constructor() {
		super(1280, 720, Phaser.AUTO, 'content', null);
		this.state.add('Level', Level, false);
		this.state.start('Level');
	}
}

new Game();
