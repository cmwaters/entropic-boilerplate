import { Renderer } from 'entropi'

export class PaperRenderer implements Renderer {

    constructor() {

    }

    render() {
        
    }

    size() {
        return { 
            width: screen.width, 
            height: screen.height
        }
    }

    add(sprite: any) {
    }

    remove(sprite: any) {
        sprite.remove()
    }

    setBackgroundColour(color: number) {
    }

    update(sprite: any, x: number, y: number, angle: number): void {
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.rotation = angle;
    }

}