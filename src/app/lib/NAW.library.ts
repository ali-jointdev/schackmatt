export const enum Terrain {
    Flat,
    Mountain,
    Road,
    Water
}

export const enum Units {
    None,
    Infantry1,
    Anti_Tank1,
    Tank1,
    Infantry2,
    Anti_Tank2,
    Tank2
}

// Game structure based on Nintendo's Advanced Wars
export class NAW {
    public board: number[][];
    public pieces: number[][];
    public turn: number;

    constructor() {
        this.board = [
            [2, 0, 4, 4, 0, 0, 1, 2],
            [2, 0, 4, 4, 2, 2, 1, 2],
            [2, 2, 2, 4, 0, 2, 2, 2],
            [2, 1, 2, 0, 0, 2, 1, 2],
            [2, 1, 2, 0, 0, 2, 1, 2],
            [2, 2, 2, 0, 4, 2, 2, 2],
            [2, 1, 2, 2, 4, 4, 0, 2],
            [2, 1, 0, 0, 4, 4, 0, 2]
        ];
        this.pieces = [
            [3, 0, 0, 0, 0, 0, 0, 6],
            [2, 0, 0, 0, 0, 0, 0, 5],
            [1, 0, 0, 0, 0, 0, 0, 4],
            [1, 0, 0, 0, 0, 0, 0, 4],
            [1, 0, 0, 0, 0, 0, 0, 4],
            [1, 0, 0, 0, 0, 0, 0, 4],
            [2, 0, 0, 0, 0, 0, 0, 5],
            [3, 0, 0, 0, 0, 0, 0, 6]
        ];
    }

    public play(): void {
        // play an instance of the game
        const numberOfTurns = 10;
        for (let i = 0; i < numberOfTurns; i++) {
            this.nextTurn();
        }
    }

    public nextTurn(): void {
        // next turn
        if (this.turn === 1) {
            this.turn = 2;
        }
    }
}
