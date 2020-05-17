import {Bound, Vector} from "./geometry";
import { Kinetic } from './kinetic'
import {Body} from "matter-js";
import {Input, Key} from "./input";

export class GenericController implements Controller {
    constructor(public object: any , public func: (entity: any, object: any) => void) {
        this.object = object;
        this.func = func;
    }
    
    execute(entity: any): void {
        this.func(entity, this.object)
    }
    
    
}

export class InputController implements Controller {
    constructor(public input: Input, public func: (entity: any, input: Input) => void) {
        this.func = func
        this.input = input
    }
    
    execute(entity: any): void {
        this.func(entity, this.input)
    }
}

export interface Controller {
    execute: (entity: any) => void
}

export namespace Controllers {

    export function directional(input: Input) : Controller {
        let func = (entity: any, input: Input) => {
            if (entity.kinetic === null) { return }
            let v = Vector.create(entity.body.velocity.x, entity.body.velocity.y)
            let a = Vector.create()
            if (input.Key.UP.state || input.Key.W.state) a.y += 1
            if (input.Key.DOWN.state || input.Key.S.state) a.y -= 1
            if (input.Key.LEFT.state || input.Key.A.state) a.x -= 1
            if (input.Key.RIGHT.state || input.Key.D.state) a.x += 1
            if (!Vector.equal(a, Vector.create())) {
                a = Vector.mult(a, entity.kinetic.acc)
                let newVelocity = Vector.add(entity.body.velocity, a)
                if (Vector.magnitude(newVelocity) > entity.kinetic.maxSpeed) {
                    let adjustedVelocity = Vector.mult(Vector.normalise(newVelocity), entity.kinetic.maxSpeed)
                    Body.setVelocity(entity.body, adjustedVelocity)
                } else {
                    Body.setVelocity(entity.body, newVelocity)
                }
            } else {
                if (!Vector.equal(entity.body.velocity, Vector.create())) {
                    let v = Kinetic.approach(entity.body.velocity, Vector.create(), entity.kinetic.acc)
                    Body.setVelocity(entity.body, v)
                }
            }
        }
        return new InputController(input, func)
    }


    export function boundary(bound: Bound): Controller {
        let func = (entity: any, bound: Bound) => {
            if (entity.body.position.x > bound.max.x) {
                Body.setPosition(entity.body, Vector.create(bound.max.x, entity.body.position.y))
            }
            if (entity.body.position.x < bound.min.x) {
                Body.setPosition(entity.body, Vector.create(bound.min.x, entity.body.position.y))
            }
            if (entity.body.position.y > bound.max.y) {
                Body.setPosition(entity.body, Vector.create(entity.body.position.x, bound.max.y))
            }
            if (entity.body.position.y < bound.min.y) {
                Body.setPosition(entity.body, Vector.create(entity.body.position.x, bound.min.y))
            }
        }
        return new GenericController(bound, func)
    }


}