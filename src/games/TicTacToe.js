import GameConcept from './GameConcept'
import Board from './../classes/Board'

export default class TicTacToe extends GameConcept
{
    constructor()
    {
        super()
        this.activeGamePieces = this.gamePieces
        this.players.map(player => player.gamePiece = this.activeGamePieces.pop())
    }

    get isBoardGame()
    {
        return true
    }

    get numberOfPlayers()
    {
        return 2
    }

    get turnBased()
    {
        return true
    }

    get gamePieces()
    {
        return ['X', 'O']
    }

    get piecesPerPerson()
    {
        return null
    }

    get boardMatrix()
    {
        return Array(3).fill( Array(3).fill('') )
    }
}