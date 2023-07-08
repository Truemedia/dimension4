import Phase from './Phase'

export default class Turn
{
    constructor(phases = [], tile)
    {
        this.phases = phases.length > 0 ? phases : [new Phase]
        this.tile = tile
    }
}