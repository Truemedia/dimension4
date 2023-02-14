import Player from './Player'

export default class HumanPlayer extends Player
{
    constructor(human = true, controllable = true)
    {
        super(human, controllable)
    }
}