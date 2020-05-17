import {Vector, Bound} from "./geometry";
import Camera from './camera'
import { Body } from './physics'
import { Sprite, Graphics } from "pixi.js"
import { Kinetic } from "./kinetic"
import { Controller } from './controller'

// Entity is by default static
export class Entity {
    name: string;
    camera: Camera;
    sprite: Sprite | Graphics;
    spriteName: string = "";
    body: Body;
    controllers: Controller[] = [];
    kinetic: Kinetic;
    offset: Vector;

    constructor(options: EntityOptions) {
        this.name = options.name
        this.body = options.usingBody;
        if (options.fromSprite !== undefined)
            this.sprite = options.fromSprite
        else if (options.fromSpriteName !== undefined)
            this.spriteName = options.fromSpriteName;

        if (options.withControllers !== undefined)
            this.controllers.push(...options.withControllers)

        if (options.withDynamicSystem !== undefined)
            this.kinetic = options.withDynamicSystem

    };

    addController(controller: Controller): void {
        this.controllers.push(controller)
    }

    equal(entity: Entity): boolean {
        return this.name === entity.name
    }

    clone(): Entity {
        let vertices: Vector[] = [];
        this.body.vertices.forEach(vertex => vertices.push(Vector.clone(vertex)))
        let cloneBody = Body.create({
            position: Vector.clone(this.offset),
            vertices: vertices
        })
        return new Entity({
            name: this.name,
            usingBody: cloneBody,
            fromSpriteName: this.spriteName,
            withControllers: this.controllers,
            withDynamicSystem: this.kinetic,
        });
    }

    X(): number {
        return this.body.position.x - this.offset.x
    }

    Y(): number {
        return this.body.position.y + this.offset.y
    }
}

export type EntityOptions = {
    name: string,
    usingBody: Body,
    fromSprite?: Sprite,
    fromSpriteName?: string,
    withControllers?: Controller[],
    withDynamicSystem?: Kinetic
}