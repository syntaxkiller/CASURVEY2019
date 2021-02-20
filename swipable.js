//credit to c4benn - https://gist.github.com/SleepWalker/da5636b1abcbaff48c4d

//to check that it's the right direction.
    const log = x => console.log(x)

class RootSwipeable {
    //offset is amount of pixels swiped to be considered a direction.
    //else multiple directions might trigger at once.
    constructor({ offset }) { 
        this.offset = offset
        this.previous = { x: null, y: null } 
    }

    updatePrevious(e) {
        this.previous.x =  e.changedTouches[0].screenX
        this.previous.y =  e.changedTouches[0].screenY
    }

    init(e) {
         !this.previous.x && !this.previous.y 
             && this.updatePrevious(e);
    }

    handleGesture(e, {
      onLeft = () => { }, 
      onRight = () => { },
      onUp = () => { }, 
      onDown = () => { } }) 
  {
    let screenX =  e.changedTouches[0].screenX,
         screenY =  e.changedTouches[0].screenY;

    if (this.previous.x + this.offset < screenX) {
        log('right')
        this.updatePrevious(e)
        onRight()
        return
    }
    if (this.previous.x - this.offset > screenX) {
        log('left')
        this.updatePrevious(e)
        onLeft()
        return
    }
    if (this.previous.y + this.offset < screenY) {
        log('down')
        this.updatePrevious(e)
        onDown()
        return
    }
    if (this.previous.y - this.offset > screenY) {
        log('up')
        this.updatePrevious(e)
        onUp()
        return
    }
  }

  kill() { this.previous = { x: null, y: null } }
}

//edited "c7x43t's" code above...
//main method.
export default class Swipeable {
    constructor({ offset }) {
        this.root = new RootSwipeable({ offset })
        this.pageWidth = window.innerWidth || document.body.clientWidth
        this.threshold = Math.max(1, Math.floor(0.01 * (this.pageWidth)))
        this.touchstart = { x: 0, y: 0 }
        this.touchend = { x: 0, y: 0 }
        this.limit = Math.tan(45 * 1.5 / 180 * Math.PI)
    }

    touchStart(e) {
        root.init(e)
        this.touchstart.x = e.changedTouches[0].screenX
        this.touchstart.y = e.changedTouches[0].screenY
    }
    touchMove(e, {
        onLeft = () => { }, 
        onRight = () => { },
        onUp = () => { },
        onDown = () => { }
    }) {
        this.touchend.x = e.changedTouches[0].screenX;
        this.touchend.y = e.changedTouches[0].screenY;
        this.handleGesture(e, { onLeft, onRight, onUp, onDown })
    }

    handleGesture(e, { onLeft, onRight, onUp, onDown }) {
        let x = this.touchend.x - this.touchstart.x,
        y = this.touchend.y - this.touchstart.y;
    
        if (Math.abs(x) > this.threshold || Math.abs(y) > this.threshold) {
   
            root.handleGestures(e, {
               onUp: () => onUp(e, y),
               onRight: () => onRight(e, x),
               onDown: () => onDown(e, y),
               onLeft: () => onLeft(e, x)
            })

            //root.handleGestures() is the initial root class above.//
        }
    }

    touchEnd() {
        root.kill()
        this.touchstart = { x: 0, y: 0 }
        this.touchend = { x: 0, y: 0 }
    }
}
