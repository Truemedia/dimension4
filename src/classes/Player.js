export default class Player
{
    constructor(human = false, controllable = false) {
        this.human = human
        this.controllable = controllable
        this.gamePiece = null
    }
}