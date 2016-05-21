
class Preview extends Phaser.State {

	preload() {
		this.load.audio('music', 'assets/music.mp3');
	}

	create() {
		// music
		let music = this.add.audio('music', 0.5, true);
		music.play();
	}

}

export default Preview;