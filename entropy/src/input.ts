export class Input {
    listening: boolean = true
    Key: any


    constructor() {
        this.Key = {
            UP: {code: "ArrowUp", state: false},
            DOWN: {code: "ArrowDown", state: false},
            LEFT: {code: "ArrowLeft", state: false},
            RIGHT: {code: "ArrowRight", state: false},
            W: {code: "KeyW", state: false},
            A: {code: "KeyA", state: false},
            S: {code: "KeyS", state: false},
            D: {code: "KeyD", state: false},
            ENTER: {code: "Enter", state: false},
            SPACE: {code: "Space", state: false},
        };
        let that = this;
        document.addEventListener('keydown', function(e: KeyboardEvent) {
            if (that.listening) {
                for (let key in that.Key) {
                    let keySet = that.Key[key];
                    if (keySet.code === e.key) {
                        keySet.state = true;
                    }
                }
            }
        })
        document.addEventListener('keyup', function(e: KeyboardEvent) {
            if (that.listening) {
                for (let key in that.Key) {
                    let keySet = that.Key[key];
                    if (keySet.code === e.key) {
                        keySet.state = false;
                    }
                }
            }
        })
    }

}

export type Key = {
    code: string,
    state: boolean,
}


