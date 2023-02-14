import Player from './Player'

export default class AiPlayer extends Player
{
    constructor(human = false, controllable = false)
    {
        super(human, controllable)
    }
}