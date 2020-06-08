import { Game, Entity, Controllers, Kinetic } from 'entropi';
import { Bodies } from 'matter-js'
import { PaperScope, Size, Path, Point, Color } from 'paper'
import { PaperRenderer } from './renderer'

let paper = new PaperScope()
let screen = new Size(800, 600)
let player: Entity

window.onload = () => {
    paper.install(window)
    let paperCanvas = <HTMLCanvasElement> document.createElement('canvas')
    paperCanvas.width = screen.width;
    paperCanvas.height = screen.height;
    document.body.style.width = screen.width.toString()
    document.body.appendChild(paperCanvas)
    paper.setup(paperCanvas)


    let game = new Game({
        renderer: new PaperRenderer(),
        create: create,
        update: update,
        options: [
            Game.withFrameRate(30),
            Game.withBackGroundColor(0xeeeeee),
        ]
    })
}

function create(game: Game) {
    let playerSprite = new Path.Circle(new Point(screen.width/2, -screen.height/2), 20);
    playerSprite.fillColor = new Color('black');

    player = game.add.newEntity({
        name: 'player',
        usingBody: Bodies.circle(screen.width/2, -screen.height/2, 20, {density: 0.1}),
        fromSprite: playerSprite,
        withControllers: [
            Controllers.directional(game.input),
        ],
        withDynamicSystem: Kinetic.create({
            maxSpeed: 5,
            proportionalGain: 0.007,
        }),
    });
}

function update(game: Game) {

}