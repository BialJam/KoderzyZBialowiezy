import GameParticle from 'objects/GameParticle';

class GameState extends Phaser.State {

	init() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        // this.game.physics.arcade.velocity.y = 100;
    }

	preload() {

	}

	create() {
		// this.physics.startSystem(Phaser.Physics.ARCADE);
		let particle = new GameParticle(this.game, this.game.world.centerX, this.game.world.centerY);
		// this.game.debug.spriteBounds(particle);

		// this.game.physics.enable(particle, Phaser.Physics.ARCADE);
	}
}

export default GameState;
