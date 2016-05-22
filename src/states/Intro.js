
class Intro extends Phaser.State {

	preload() {
		this.load.audio('music', 'assets/music.mp3');
		this.load.image('logo', 'assets_8bit/logo.png')
	}

	create() {
		this.stage.backgroundColor = '#000'
		// music
		let music = this.add.audio('music', 0.5, true);
		//music.play();

		// copyrights text
		let style = { font: "26px Press Start 2P", align: "center", fill: "white" };
		let text_value = 'TM   AND   ©     2016 \n \
				KODERZY    Z     BIALOWIEZY    CO    LTD \n \
				LICENSED    BY\n NINTENDO    OF     AMERICA     INC'
		let text = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 200, text_value , style)
		text.anchor.set(0.5);

		// logo
		let logo = this.add.sprite(this.game.world.centerX, -200, 'logo');
		logo.scale.setTo(0.5, 0.5);
		logo.anchor.set(0.5);
		logo.enableUpdate = true;
		let animation = this.add.tween(logo).to( { y: this.game.world.centerY-(logo.height/2) +100 }, 7000, "Quart.easeOut");
		animation.start();
		animation.killOnComplete = true;
		animation.onComplete.add(function() {
	  		this.game.state.start('Preview');
	  		music.stop();
		}, logo);
	}

}

export default Intro;
