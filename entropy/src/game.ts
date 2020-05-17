import {Entity, EntityOptions} from './entity'
import {Input} from './input'
import { Controllers } from './controller'
import { Kinetic } from './kinetic'
import Camera from './camera'
import {Vector, Bound} from './geometry'
import {Body, Composite} from './physics'
import { Engine, World } from 'matter-js'
import * as PIXI from 'pixi.js'
import { Factory } from './factory'
// const random = require('random');
// const seedrandom = require('seedrandom');

export let Graphics = PIXI.Graphics

export { Camera, Vector, Entity, Kinetic, Body, Controllers, Bound, Factory}

const DEFAULT_FRAME_RATE = 20;

export class Game {

    constructor(setup : Setup) {
        // set variables
        this.height = setup.height;
        this.width = setup.width;
        this.create = setup.create;
        this.update = setup.update;
        this.backgroundColor = 0xffffff;
        this.center = Vector.create(this.width/2, this.height/2);
        this.camera = new Camera(this.center);
        this.input = new Input()
        this.entities = [];
        this.time = {
            running: false,
            tick: 0,
            frameRate: DEFAULT_FRAME_RATE
        };
        // run options
        if (setup.options != null) {
            setup.options.forEach(option => {
                option(this)
            })
        }
        // initiate stuff
        this.renderer = new PIXI.Application({
            backgroundColor: this.backgroundColor,
            autoStart: this.autoStart,
            width: this.width,
            height: this.height
        })
        document.body.appendChild(this.renderer.view)
        this.physics = Engine.create()
        this.physics.world.gravity.y = 0;
        this.interval = setInterval(() => {
            if (this.time.running) {
                this.run()
            }
        }, this.time.frameRate);
        this.add = {
            spritesheet: (source: string) => {
                this.renderer.loader.add('spritesheet', source)
            },
            entity: (entity: Entity) => {
                this.entities.push(entity)
            },
            newEntity: (options: EntityOptions) : Entity => {
                let entity = new Entity(options);
                if (entity.sprite !== undefined) {
                    this.renderer.stage.addChild(entity.sprite)
                }
                this.entities.push(entity)
                return entity
            },
            entities: (entities: Entity[]): Entity[] => {
                this.entities.push(...entities)
                return entities
            },
        }
        this.create(this);
        this.renderer.loader.load( () => {
            this.entities.forEach(entity => {
                World.addBody(this.physics.world, entity.body)
                console.log(entity.spriteName)
                if (entity.spriteName !== "") {
                    entity.sprite = PIXI.Sprite.from(entity.spriteName)
                    entity.sprite.x = entity.body.position.x;
                    entity.sprite.y = entity.body.position.y;
                    console.log("Added sprite: " + entity.sprite.x + " - " + entity.sprite.y)
                    this.renderer.stage.addChild(entity.sprite)
                }
            })
            if (this.autoStart) {
                this.start();
            }
        });
    }

    width: number;
    height: number;
    create: (game: Game) => void;
    update: (game: Game) => void;
    backgroundColor: number
    autoStart: boolean = true;
    renderer: PIXI.Application;
    camera: Camera;
    center: Vector;
    time: TimeKeeper;
    interval: NodeJS.Timer;
    controller: any
    physics: Engine
    entities : Entity[]; // creates an ordered list of entities
    add : any;
    input: Input

    start() {
        console.log("starting game");
        this.time.running = true;
        this.renderer.start()
    }

    run() {
        // read inputs and actuate controllers
        this.actuateControllers()
        // execute game logic
        this.update(this)
        // update world via physics engine
        Engine.update(this.physics, this.time.frameRate)
        // camera
        this.camera.update()
        // render all entities
        this.setRender()
        // reset
    }

    stop() {
        this.renderer.stop()
        this.time.running = false;
    }

    actuateControllers() :void {
        this.input.listening = false;
        this.entities.forEach(entity => {
            entity.controllers.forEach(controller => {
                controller.execute(entity)
            })
        })
        this.input.listening = true;
    }

    get(entityName: string) : Entity {
        this.entities.forEach(entity => {
            if (entity.name === entityName) {
                return entity
            }
        })
        return null
    }

    setRender() {
        this.camera.update()
        this.entities.forEach(entity => {
            entity.sprite.x = this.camera.pos.x + entity.body.position.x;
            entity.sprite.y = this.camera.pos.y - entity.body.position.y;
        })
    }

    bodies(): Body[] {
        return Composite.allBodies(this.physics.world)
    }

    convertGraphicToSprite(shape: PIXI.Graphics): PIXI.Sprite {
        return new PIXI.Sprite(this.renderer.renderer.generateTexture(shape, PIXI.SCALE_MODES.LINEAR, 1))
    }



}

export type TimeKeeper  = {
    running : boolean,
    tick : number,
    frameRate: number
}

type Option = (game: Game) => void

export type Setup = {
    width : number,
    height : number,
    create : (game: Game) => any,
    update : (game: Game) => any,
    options? : Option[],
}

export function WithFrameRate(frameRate: number) : Option {
    return (game : Game) => {
        game.time.frameRate = frameRate
    }
}

export function WithBackGroundColor(color: number) : Option {
    return (game : Game) => {
        game.backgroundColor = color
    }
}