import { Game } from 'entropic';

window.onload = () => {
    let game = new Game({
        renderer: null,
        create: create,
        update: update,
        options: [
            Game.withFrameRate(30),
            Game.withBackGroundColor(0xeeeeee),
        ]
    })
}

function create(game: Game) {

}

function update(game: Game) {

}