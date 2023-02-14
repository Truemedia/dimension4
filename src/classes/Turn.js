import Phase from './Phase'

export default class Turn
{
    constructor(phases = [])
    {
        this.phases = phases.length > 0 ? phases : [new Phase]
    }
}