import { Component, OnInit } from '@angular/core';
import { Game, Square } from '../lib/game.library';

import { NAW, Terrain } from '../lib/NAW.library';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
    public redWins: number;
    public blueWins: number;
    public mountainImage: any;

    private game: NAW;
    private boardCanvas: any;
    private boardContext: any;
    private boardImage: any;
    private pieceImages: any[];
    private CURSOR_DATA: {
        mouseOverBoard: boolean;
        currentMousePosition: {
            x: number;
            y: number;
        };
        overSquare: {
            x: number;
            y: number;
        };
        mouseDownOn: {
            x: number;
            y: number;
        };
        mouseUpOn: {
            x: number;
            y: number;
        };
        dragging: boolean;
        draggedPieceIndex: number;
    };
    private tintSqObjects: {
        dest: Square;
        color: string;
        gA: number;
    }[];

    constructor() {
        // this.game = new Game();
        this.redWins = 0;
        this.blueWins = 0;
        this.game = new NAW();
        this.CURSOR_DATA = {
            mouseOverBoard: false,
            currentMousePosition: {
                x: -1,
                y: -1
            },
            overSquare: null,
            mouseDownOn: null,
            mouseUpOn: null,
            dragging: false,
            draggedPieceIndex: -1
        };
        this.tintSqObjects = [];
        console.log(this.game.toString());
    }

    ngOnInit() {
        this.boardCanvas = document.getElementById('board');
        this.boardCanvas.oncontextmenu = (events: any) => {
            events.preventDefault();
        };
        this.boardContext = this.boardCanvas.getContext('2d');
        this.pieceImages = [];

        // temporary return statement to stop draw errors

        // doing pieces first
        const pieceSources = [
            'infantryB',
            'artilleryB',
            'tankB',
            'infantryA',
            'artilleryA',
            'tankA'
        ];
        for (const pieceSrc of pieceSources) {
            const pImg = new Image();
            pImg.src = '../../assets/units/' + pieceSrc + '.png';
            this.pieceImages.push(pImg);
        }

        this.mountainImage = new Image();
        this.mountainImage.src = '../../assets/mountain.png';

        this.boardImage = new Image();
        this.boardImage.src = '../../assets/board_640x640.png';
        // because apparently I have to wait on the image smh
        this.boardImage.onload = () => {
            this.drawBoard();
        };

        return;
        //     // listeners
        //     this.boardCanvas.addEventListener('mouseenter', () => {
        //         this.CURSOR_DATA.mouseOverBoard = true;
        //     });
        //     this.boardCanvas.addEventListener('mouseleave', () => {
        //         this.CURSOR_DATA.mouseOverBoard = false;
        //         this.CURSOR_DATA.currentMousePosition = { x: -1, y: -1 };
        //         this.CURSOR_DATA.overSquare = null;
        //         this.tintSqObjects = [];
        //         this.CURSOR_DATA.draggedPieceIndex = -1;
        //         this.drawBoard();
        //     });
        //     this.boardCanvas.addEventListener('mousemove', (events: any) => {
        //         if (this.CURSOR_DATA.mouseOverBoard) {
        //             this.CURSOR_DATA.currentMousePosition = this.getMousePosition(
        //                 events
        //             );
        //             let x = this.CURSOR_DATA.currentMousePosition.x;
        //             let y = this.CURSOR_DATA.currentMousePosition.y;
        //             x -= x % 80;
        //             y -= y % 80;
        //             x /= 80;
        //             y /= 80;
        //             if (
        //                 this.CURSOR_DATA.overSquare === null ||
        //                 this.CURSOR_DATA.overSquare.x !== x ||
        //                 this.CURSOR_DATA.overSquare.y !== y
        //             ) {
        //                 // console.log('xy', x, y);
        //                 // ooh tslint taught me shorthand
        //                 this.CURSOR_DATA.overSquare = { x, y };
        //                 this.showMoves();
        //             }
        //         }
        //         this.drawBoard();
        //     });
        //     this.boardCanvas.addEventListener('mousedown', () => {
        //         if (this.CURSOR_DATA.overSquare) {
        //             this.CURSOR_DATA.mouseDownOn = this.CURSOR_DATA.overSquare;
        //             this.CURSOR_DATA.dragging = true;
        //         } else {
        //             throw new Error('mouse down not over sq');
        //         }
        //     });
        //     this.boardCanvas.addEventListener('mouseup', () => {
        //         if (this.CURSOR_DATA.overSquare) {
        //             this.CURSOR_DATA.mouseUpOn = this.CURSOR_DATA.overSquare;
        //             this.CURSOR_DATA.dragging = false;
        //             this.CURSOR_DATA.draggedPieceIndex = -1;
        //             this.attemptMoveOnBoard();
        //         } else {
        //             throw new Error('mouse up not over sq');
        //         }
        //     });
    }

    public demoOneGame(): void {
        console.log('game start');
        this.play(1, 500, 1, 1, 1);
    }

    public demoTwo(): void {
        console.log('game start');
        this.play(100, 1, 1, 1, 10);
    }
    public demoThree(): void {
        console.log('game start');
        this.play(100, 1, 1, 5, 3);
    }
    public demoFour(): void {
        console.log('game start');
        this.play(100, 1, 1, 10000, 1);
    }

    public play(
        games: number,
        delay: number,
        cap1: number,
        cap2: number,
        ratio: number
    ): void {
        console.log('playing games left: ', games);
        this.game.reset();
        // play an instance of the game
        const numberOfTurns = 500;
        let turns = 0;
        // for (let i = 0; i < numberOfTurns; i++) {
        const interval = setInterval(() => {
            this.game.nextTurn(cap1, cap2, ratio);
            this.drawBoard();
            turns++;
            if (turns >= numberOfTurns || this.game.isOver()) {
                clearInterval(interval);
                if (games > 1) {
                    this.play(games - 1, delay, cap1, cap2, ratio);
                } else {
                    // print data
                    setTimeout(() => {
                        this.boardContext.fillStyle = 'white';
                        this.boardContext.globalAlpha = 0.7;
                        this.boardContext.fillRect(0, 0, 640, 640);
                        console.log('game end');
                        this.redWins = this.game.redWins;
                        this.blueWins = this.game.blueWins;
                        // console.log('', this.redWins, this.blueWins);

                        let max = 0;
                        for (let i = 0; i < 8; i++) {
                            for (let j = 0; j < 8; j++) {
                                if (this.game.heatmap2[i][j] > max) {
                                    max = this.game.heatmap2[i][j];
                                }
                                if (this.game.heatmap1[i][j] > max) {
                                    max = this.game.heatmap1[i][j];
                                }
                            }
                        }

                        this.drawHeatmap(this.game.heatmap2, 'red', max);
                        this.drawHeatmap(this.game.heatmap1, 'blue', max);
                    }, 2000);
                }
            }
        }, delay);
        // }
    }

    // showMoves(): void {
    //     const pieceMovements = this.game.getPieceMovements();
    //     const sq = {
    //         file: this.CURSOR_DATA.overSquare.x,
    //         rank: 7 - this.CURSOR_DATA.overSquare.y
    //     };
    //     this.tintSqObjects = [];
    //     for (const movement of pieceMovements) {
    //         // console.log('move', movement);
    //         if (
    //             movement.src.file === sq.file &&
    //             movement.src.rank === sq.rank
    //         ) {
    //             // console.log('trigger');
    //             this.tintSqObjects.push({
    //                 dest: {
    //                     file: movement.dest.file,
    //                     rank: 7 - movement.dest.rank
    //                 },
    //                 color: 'green',
    //                 gA: 0.01
    //             });
    //         }
    //     }
    // }

    // attemptMoveOnBoard(): void {
    //     // does not matter what the resulting board is here,
    //     // we are just passing the src and dest
    //     this.game.attemptMove({
    //         src: {
    //             file: this.CURSOR_DATA.mouseDownOn.x,
    //             rank: 7 - this.CURSOR_DATA.mouseDownOn.y
    //         },
    //         dest: {
    //             file: this.CURSOR_DATA.mouseUpOn.x,
    //             rank: 7 - this.CURSOR_DATA.mouseUpOn.y
    //         },
    //         resultingBoard: null
    //     });
    // }

    // getMousePosition(events: any): { x: number; y: number } {
    //     let obj = this.boardCanvas;
    //     let top = 0;
    //     let left = 0;
    //     let mX = 0;
    //     let mY = 0;
    //     while (obj && obj.tagName !== 'BODY') {
    //         top += obj.offsetTop;
    //         left += obj.offsetLeft;
    //         obj = obj.offsetParent;
    //     }
    //     mX = events.clientX - left + window.pageXOffset;
    //     mY = events.clientY - top + window.pageYOffset;
    //     return { x: mX, y: mY };
    // }

    drawHeatmap(hm: any, color: string, max: number): void {
        this.boardContext.restore();
        this.boardContext.globalAlpha = 1;
        this.boardContext.fillStyle = color;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.boardContext.globalAlpha = hm[i][j] / max;
                if (color === 'blue') {
                    this.boardContext.globalAlpha /= 1.2;
                }
                this.boardContext.fillRect((7 - j) * 80, i * 80, 80, 80);
                this.boardContext.globalAlpha = 1;
            }
        }
    }

    drawBoard(): void {
        this.boardContext.restore();
        this.boardContext.globalAlpha = 1;
        // this.boardContext.fillStyle = 'yellow';
        // this.boardContext.fillRect(0, 0, 40, 40);
        // this.boardContext.drawImage(this.boardImage, 0, 0);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                // this.refreshCanvasSquare(i, j);
                switch (this.game.board[i][j]) {
                    case Terrain.Flat:
                        this.boardContext.fillStyle = '#05a805';
                        this.boardContext.fillRect(
                            (7 - j) * 80,
                            i * 80,
                            80,
                            80
                        );
                        break;
                    case Terrain.Water:
                        this.boardContext.fillStyle = '#1c95ff';
                        this.boardContext.fillRect(
                            (7 - j) * 80,
                            i * 80,
                            80,
                            80
                        );
                        break;
                    case Terrain.Mountain:
                        this.boardContext.fillStyle = '#473d21';
                        this.boardContext.fillRect(
                            (7 - j) * 80,
                            i * 80,
                            80,
                            80
                        );
                        // this.boardContext.drawImage(
                        //     this.mountainImage,
                        //     (7 - j) * 80,
                        //     i * 80 - 20
                        // );
                        break;
                    case Terrain.Road:
                        this.boardContext.fillStyle = '#555955';
                        this.boardContext.fillRect(
                            (7 - j) * 80,
                            i * 80,
                            80,
                            80
                        );
                        break;
                }
                switch (this.game.pieces[i][j]) {
                    case 0:
                        break;
                    default:
                        this.boardContext.drawImage(
                            this.pieceImages[this.game.pieces[i][j] - 1],
                            (7 - j) * 80,
                            i * 80
                        );
                        break;
                }
            }
        }
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                // this.refreshCanvasSquare(i, j);
                switch (this.game.board[i][j]) {
                    case Terrain.Mountain:
                        this.boardContext.drawImage(
                            this.mountainImage,
                            (7 - j) * 80,
                            i * 80 - 40
                        );
                        break;
                }
            }
        }
        // if (this.CURSOR_DATA.draggedPieceIndex !== -1) {
        //     this.boardContext.drawImage(
        //         this.pieceImages[this.CURSOR_DATA.draggedPieceIndex],
        //         this.CURSOR_DATA.currentMousePosition.x - 40,
        //         this.CURSOR_DATA.currentMousePosition.y - 40
        //     );
        // }
    }

    // refreshCanvasSquare(x: number, y: number): void {
    //     const piece = this.game.getPiece({ file: x, rank: y });
    //     if (
    //         this.CURSOR_DATA.overSquare &&
    //         this.CURSOR_DATA.overSquare.x === x &&
    //         this.CURSOR_DATA.overSquare.y === 7 - y
    //     ) {
    //         this.tintSquare(x, 7 - y, 'yellow', 0.5);
    //         this.boardContext.globalAlpha = 1; // reset this to full
    //     }
    //     for (const tintSq of this.tintSqObjects) {
    //         this.tintSquare(
    //             tintSq.dest.file,
    //             tintSq.dest.rank,
    //             tintSq.color,
    //             tintSq.gA
    //         );
    //     }
    //     this.boardContext.globalAlpha = 1;
    //     if (piece) {
    //         const color = piece.color;
    //         const pieceType = piece.type;
    //         const index = (color ? 6 : 0) + pieceType;
    //         if (
    //             this.CURSOR_DATA.dragging &&
    //             this.CURSOR_DATA.mouseDownOn.x === x &&
    //             this.CURSOR_DATA.mouseDownOn.y === 7 - y
    //         ) {
    //             this.CURSOR_DATA.draggedPieceIndex = index;
    //         } else {
    //             this.boardContext.drawImage(
    //                 this.pieceImages[index],
    //                 x * 80,
    //                 (7 - y) * 80
    //             );
    //         }
    //     }
    // }

    // tintSquare(x: number, y: number, color: string, globalAlpha: number): void {
    //     this.boardContext.globalAlpha = globalAlpha;
    //     this.boardContext.fillStyle = color;
    //     this.boardContext.fillRect(x * 80, y * 80, 80, 80);
    // }
}
