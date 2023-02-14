import AiPlayer from './../classes/AiPlayer'
import HumanPlayer from './../classes/HumanPlayer'
import Turn from './../classes/Turn'
import SquareBoard from './../boards/SquareBoard'

const DEFAULT_LOCKED = true

export default class GameConcept
{
    constructor() {
        this.players = []
        // this.makeBoard()
        this.allocatePlayers()
        this.board = null
        this.sb = new SquareBoard
        this.locked = DEFAULT_LOCKED
        this.turns = []
    }

    get activePlayer()
    {
        return this.playerByNumber( this.playerNumberByTurnNumber(this.numberOfTurns) )
    }

    startGame()
    {
        this.iterateTurn()
    }

    playerByNumber(n)
    {
        return this.players[n - 1]
    }

    playerNumberByTurnNumber(turnNumber)
    {
        let {numberOfPlayers} = this
        let roundNumber = this.roundNumber(numberOfPlayers, turnNumber)

        return numberOfPlayers - (this.finalTurnOfRoundNumber(roundNumber, numberOfPlayers) - turnNumber)
    }

    finalTurnOfRoundNumber(roundNumber, numberOfPlayers)
    {
        return (roundNumber * numberOfPlayers)
    }

    roundNumber(numberOfPlayers, numberOfTurns)
    {
        return Math.ceil(numberOfTurns / numberOfPlayers)
    }

    get numberOfRounds()
    {
        let {numberOfPlayers, numberOfTurns} = this

        return this.roundNumber(numberOfPlayers, numberOfTurns)
    }

    get numberOfTurns()
    {
        return this.turns.length
    }

    get previousTurn() {
        return (this.turns.length > 0) ? this.turns[this.turns.length - 1] : null
    }

    get nextTurn() {
        return new Turn
    }
    
    get currentTurn() {
        return (this.turns.length > 0) ? this.turns[this.turns.length] : null
    }

    takeTurn(turn)
    {
        this.turns.push(turn)
    }

    iterateTurn()
    {
        this.takeTurn(this.nextTurn)
        
        let {activePlayer} = this
        if (activePlayer.controllable) {
            this.unlock()
        } else {
            this.lock()
        }
    }

    allocatePlayers(players = [])
    {
        this.allocatePlayer( new HumanPlayer )
        while (this.numberOfPlayers > this.players.length) {
            this.players.push(new AiPlayer)
        }
    }

    allocatePlayer(player)
    {
        this.players.push(player)
    }

    get isLocked() {
        return this.locked
    }

    lock() {
        this.locked = true
    }

    unlock() {
        this.locked = false
    }

    get rows() {
        return this.isBoardGame ? this.boardMatrix.length : null
    }

    get columns() {
        if (this.isBoardGame) {
            let [columnCount] = this.boardMatrix.map( (columns) => columns.length)
            return columnCount
        } else {
            return null
        }
    }

    freshBoard() {
        this.board = [...this.boardMatrix]
    }
}