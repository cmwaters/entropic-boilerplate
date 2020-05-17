import * as Entropy from 'entropy';

let player : Entropy.Entity

window.onload = () => {
    let game = new Entropy.Game({
        width: 800,
        height: 600,
        create: create,
        update: update,
        options: [
            Entropy.WithFrameRate(30),
            Entropy.WithBackGroundColor(0xeeeeee),
        ]
    })
}

function create(game: Entropy.Game) {
    let playerSprite = new Entropy.Graphics()
    playerSprite.beginFill(0x000000, 1);
    playerSprite.drawCircle(100, 100, 20);
    playerSprite.endFill();

    player = game.add.newEntity({
        name: 'player',
        usingBody: Entropy.Body.circle(100, 100, 20),
        fromSprite: playerSprite,
        withControllers: [
            Entropy.Controllers.directional(game.input)],
        withDynamicSystem: Entropy.Kinetic.create(5, 1)
    })
}

function update(game: Entropy.Game) {

}