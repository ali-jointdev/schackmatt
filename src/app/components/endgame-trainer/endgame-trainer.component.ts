import { Component, OnInit, ViewChild, ɵCurrencyIndex } from '@angular/core';
import {
    Board,
    Color,
    File,
    Game,
    Piece,
    PieceType,
    Rank
} from 'src/app/lib/game.library';
import { GameEvent, Move } from 'src/app/lib/interface.library';
import { GameComponent } from '../game/game.component';

@Component({
    selector: 'app-endgame-trainer',
    templateUrl: './endgame-trainer.component.html',
    styleUrls: ['./endgame-trainer.component.css']
})
export class EndgameTrainerComponent implements OnInit {
    @ViewChild('gameComponent') _gameComponent: GameComponent;
    private _game: Game;
    private _interfaceCommand: string;
    // TODO not any
    private _endgameTrainingSets: any[];
    private _currentTrainingSet: any;

    constructor() {
        this._endgameTrainingSets = [
            {
                name: 'King & Pawn Box-rule',
                boardSetup: (board: Board): void => {
                    // random rank between 3 & 5 inclusive
                    let r = Math.floor(Math.random() * 3) + 2;
                    let f = Math.floor(Math.random() * 4);
                    if (f > 1) {
                        f += 4;
                    }
                    board.insertPiece(
                        {
                            file: f,
                            rank: r
                        },
                        new Piece(PieceType.Pawn, Color.Black)
                    );
                    board.insertPiece(
                        {
                            // calculated position of King
                            file: f > 1 ? f - (r + 1) : f + (r + 1),
                            rank: r + 1
                        },
                        new Piece(PieceType.King, Color.White)
                    );
                    board.insertPiece(
                        {
                            file: Math.floor(Math.random() * 8),
                            rank: r + 3
                        },
                        new Piece(PieceType.King, Color.Black)
                    );
                },
                moveValidator: (board: Board, move: Move): boolean => {
                    let pawnLocation = board.findPiece(
                        new Piece(PieceType.Pawn, Color.Black)
                    )[0];
                    let kingLocation = board.findPiece(
                        new Piece(PieceType.King, Color.White)
                    )[0];
                    if (
                        pawnLocation.rank === kingLocation.rank &&
                        Math.abs(pawnLocation.file - kingLocation.file) ===
                            pawnLocation.rank
                    ) {
                        return true;
                    }
                    return false;
                },
                completed: (board: Board): boolean => {
                    let blackPawns = board.findPiece(
                        new Piece(PieceType.Pawn, Color.Black)
                    );
                    if (blackPawns.length === 0) {
                        return true;
                    }
                    return false;
                }
            }
        ];

        this._currentTrainingSet = this._endgameTrainingSets[0];
    }

    ngOnInit() {
        this._game = new Game();
        // start with an empty board
        this.setupEndgameTrainingSet(this.currentTrainingSet);
        // console.log(this.game);
    }

    private setupEndgameTrainingSet(set): void {
        let emptyBoardFEN = '8/8/8/8/8/8/8/8 w - - 0 1';
        this._game.setFEN(emptyBoardFEN);
        this._game.loadFEN();
        let board = this.game.getBoard();
        set.boardSetup(board);
        this.game.updateFENPiecesPositionsFromBoard();
    }

    public gameDataEvent(event: GameEvent) {
        console.log(event);
        if (this.currentTrainingSet.completed(this.game.getBoard())) {
            // reset
            setTimeout(() => {
                alert('good job!');
                this.setupEndgameTrainingSet(this.currentTrainingSet);
                console.log('g', this.game);
                this._gameComponent.setDisplayedMoveIndex(0);
                setTimeout(() => {
                    this.triggerInterfaceCommand('redraw board');
                }, 10);
            }, 2000);
        } else if (
            // trigger black's move if white's is correct
            this.currentTrainingSet.moveValidator(this.game.getBoard(), event)
        ) {
            let pawnLocation = this.game
                .getBoard()
                .findPiece(new Piece(PieceType.Pawn, Color.Black))[0];
            let dest = {
                file: pawnLocation.file,
                rank: pawnLocation.rank - 1
            };
            let moveNotation = this.game.squareToString(dest);
            if (dest.rank === Rank.ONE) {
                moveNotation += '=Q+';
            }
            setTimeout(() => {
                this.game.makeMove(moveNotation);
                this.triggerInterfaceCommand('move made, redraw board');
            }, 1000);
        }
    }

    private triggerInterfaceCommand(command: string) {
        this._interfaceCommand = command;
        // using setTimeout because it appears that a slight delay before reset
        // helps to trigger change detection smoothly (research required?)
        setTimeout(() => {
            this._interfaceCommand = null;
        }, 10);
    }

    get game(): Game {
        return this._game;
    }
    get interfaceCommand(): string {
        return this._interfaceCommand;
    }
    // TODO not any
    get currentTrainingSet(): any {
        return this._currentTrainingSet;
    }
}
