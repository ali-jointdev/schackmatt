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
    public heatmap1: number[][];
    public heatmap2: number[][];
    public turn: number;
    public redWins: number;
    public blueWins: number;
    public capValue1: number;
    public capValue2: number;
    public ratio: number;

    constructor() {
        this.redWins = 0;
        this.blueWins = 0;
        this.heatmap1 = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.heatmap2 = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.reset();
    }

    public nextTurn(cap1: number, cap2: number, ratio: number): void {
        this.capValue1 = cap1;
        this.capValue2 = cap2;
        this.ratio = ratio;
        // console.log('turn', this.turn);
        // next turn
        const sources = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const p = this.pieces[i][j];
                if (p !== Units.None) {
                    sources.push({ i, j, p });
                }
            }
        }
        for (const src of sources) {
            // infantry
            if (src.p === Units.Infantry1) {
                this.infantry1(src, 2);
            }
            // antitank
            if (src.p === Units.Anti_Tank1) {
                this.antitank1(src, 1);
            }
            // tank
            if (src.p === Units.Tank1) {
                this.tank1(src, 4);
            }
            //
            // infantry
            if (src.p === Units.Infantry2) {
                this.infantry2(src, 2);
            }
            // antitank
            if (src.p === Units.Anti_Tank2) {
                this.antitank2(src, 1);
            }
            // tank
            if (src.p === Units.Tank2) {
                this.tank2(src, 4);
            }
        }
        this.turn++;
    }

    public reset(): void {
        this.board = [
            [2, 1, 0, 0, 0, 0, 1, 2],
            [2, 0, 0, 0, 2, 2, 1, 2],
            [2, 2, 2, 0, 0, 2, 2, 2],
            [2, 1, 2, 0, 1, 2, 1, 2],
            [2, 1, 2, 1, 0, 2, 1, 2],
            [2, 2, 2, 0, 0, 2, 2, 2],
            [2, 1, 2, 2, 0, 0, 0, 2],
            [2, 1, 0, 0, 0, 0, 1, 2]
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
        this.turn = 1;
    }

    public isOver(): boolean {
        let one = false;
        let two = false;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (
                    this.pieces[i][j] === 1 ||
                    this.pieces[i][j] === 2 ||
                    this.pieces[i][j] === 3
                ) {
                    one = true;
                }
                if (
                    this.pieces[i][j] === 4 ||
                    this.pieces[i][j] === 5 ||
                    this.pieces[i][j] === 6
                ) {
                    two = true;
                }
            }
        }
        if (one && two) {
            return false;
        }
        if (two) {
            console.log('blue wins!');
            this.blueWins++;
        } else {
            console.log('red wins!');
            this.redWins++;
        }
        return true;
    }

    private infantry1(src: any, movementsLeft: number): void {
        // console.log('infantry 1', src);
        const dests = this.getAdjacentSqs(src);
        const options = [];
        for (const d of dests) {
            if (
                d.i < 8 &&
                d.i > -1 &&
                d.j < 8 &&
                d.j > -1 &&
                this.board[d.i][d.j] !== Terrain.Mountain &&
                (this.pieces[d.i][d.j] === Units.None ||
                    this.pieces[d.i][d.j] === Units.Anti_Tank2 ||
                    this.pieces[d.i][d.j] === Units.Infantry2)
            ) {
                options.push(d);
                // incentivize center
                if ((d.i === 4 || d.i === 3) && (d.j === 4 || d.j === 3)) {
                    for (let iter = 0; iter < this.capValue1; iter++) {
                        options.push(d);
                    }
                }
                if (d.i >= 2 && d.i <= 5 && d.j >= 2 && d.j <= 5) {
                    for (let iter = 0; iter < this.capValue1; iter++) {
                        options.push(d);
                    }
                }
                // incentivize capture
                if (this.pieces[d.i][d.j] !== Units.None) {
                    for (
                        let iter = 0;
                        iter < this.capValue1 * this.ratio;
                        iter++
                    ) {
                        options.push(d);
                    }
                }
            }
        }
        // console.log('opt', options);
        if (options.length > 0) {
            const indexChoice = Math.floor(Math.random() * options.length);
            const choice = options[indexChoice];
            if (this.pieces[choice.i][choice.j] !== Units.None) {
                this.heatmap1[choice.i][choice.j] += 1;
            }
            this.pieces[choice.i][choice.j] = this.pieces[src.i][src.j];
            this.pieces[src.i][src.j] = Units.None;
            if (this.board[choice.i][choice.j] === Terrain.Flat) {
                movementsLeft--;
            }
            if (movementsLeft > 1) {
                this.infantry1(choice, movementsLeft - 1);
            }
        }
    }

    private antitank1(src: any, movementsLeft: number): void {
        // console.log('antitank1', src);
        const dests = this.getAdjacentSqs(src);
        const options = [];
        for (const d of dests) {
            if (
                d.i < 8 &&
                d.i > -1 &&
                d.j < 8 &&
                d.j > -1 &&
                this.board[d.i][d.j] !== Terrain.Mountain &&
                (this.pieces[d.i][d.j] === Units.None ||
                    this.pieces[d.i][d.j] === Units.Anti_Tank2 ||
                    this.pieces[d.i][d.j] === Units.Tank2)
            ) {
                options.push(d);
                // incentivize center
                if ((d.i === 4 || d.i === 3) && (d.j === 4 || d.j === 3)) {
                    for (let iter = 0; iter < this.capValue1; iter++) {
                        options.push(d);
                    }
                }
                if (d.i >= 2 && d.i <= 5 && d.j >= 2 && d.j <= 5) {
                    for (let iter = 0; iter < this.capValue1; iter++) {
                        options.push(d);
                    }
                }
                // incentivize capture
                if (this.pieces[d.i][d.j] !== Units.None) {
                    for (
                        let iter = 0;
                        iter < this.capValue1 * this.ratio;
                        iter++
                    ) {
                        options.push(d);
                    }
                }
            }
        }
        // console.log('opt', options);
        if (options.length > 0) {
            const indexChoice = Math.floor(Math.random() * options.length);
            const choice = options[indexChoice];
            if (this.pieces[choice.i][choice.j] !== Units.None) {
                this.heatmap1[choice.i][choice.j] += 1;
            }
            this.pieces[choice.i][choice.j] = this.pieces[src.i][src.j];
            this.pieces[src.i][src.j] = Units.None;
            if (this.board[choice.i][choice.j] === Terrain.Flat) {
                movementsLeft--;
            }
            if (movementsLeft > 1) {
                this.antitank1(choice, movementsLeft - 1);
            }
        }
    }

    private tank1(src: any, movementsLeft: number): void {
        // console.log('tank1', src);
        const dests = this.getAdjacentSqs(src);
        const options = [];
        for (const d of dests) {
            if (
                d.i < 8 &&
                d.i > -1 &&
                d.j < 8 &&
                d.j > -1 &&
                this.board[d.i][d.j] !== Terrain.Mountain &&
                (this.pieces[d.i][d.j] === Units.None ||
                    this.pieces[d.i][d.j] === Units.Tank2 ||
                    this.pieces[d.i][d.j] === Units.Infantry2)
            ) {
                options.push(d);
                // incentivize center
                if ((d.i === 4 || d.i === 3) && (d.j === 4 || d.j === 3)) {
                    for (let iter = 0; iter < this.capValue1; iter++) {
                        options.push(d);
                    }
                }
                if (d.i >= 2 && d.i <= 5 && d.j >= 2 && d.j <= 5) {
                    for (let iter = 0; iter < this.capValue1; iter++) {
                        options.push(d);
                    }
                }
                // incentivize capture
                if (this.pieces[d.i][d.j] !== Units.None) {
                    for (
                        let iter = 0;
                        iter < this.capValue1 * this.ratio;
                        iter++
                    ) {
                        options.push(d);
                    }
                }
            }
        }
        // console.log('opt', options);
        if (options.length > 0) {
            const indexChoice = Math.floor(Math.random() * options.length);
            const choice = options[indexChoice];
            if (this.pieces[choice.i][choice.j] !== Units.None) {
                this.heatmap1[choice.i][choice.j] += 1;
            }
            this.pieces[choice.i][choice.j] = this.pieces[src.i][src.j];
            this.pieces[src.i][src.j] = Units.None;
            if (this.board[choice.i][choice.j] === Terrain.Flat) {
                movementsLeft--;
            }
            if (movementsLeft > 1) {
                this.tank1(choice, movementsLeft - 1);
            }
        }
    }

    ///
    private infantry2(src: any, movementsLeft: number): void {
        // console.log('2');
        const dests = this.getAdjacentSqs(src);
        const options = [];
        for (const d of dests) {
            if (
                d.i < 8 &&
                d.i > -1 &&
                d.j < 8 &&
                d.j > -1 &&
                this.board[d.i][d.j] !== Terrain.Mountain &&
                (this.pieces[d.i][d.j] === Units.None ||
                    this.pieces[d.i][d.j] === Units.Anti_Tank1 ||
                    this.pieces[d.i][d.j] === Units.Infantry1)
            ) {
                options.push(d);
                // incentivize center
                if ((d.i === 4 || d.i === 3) && (d.j === 4 || d.j === 3)) {
                    for (let iter = 0; iter < this.capValue2; iter++) {
                        options.push(d);
                    }
                }
                if (d.i >= 2 && d.i <= 5 && d.j >= 2 && d.j <= 5) {
                    for (let iter = 0; iter < this.capValue2; iter++) {
                        options.push(d);
                    }
                }
                // incentivize capture
                if (this.pieces[d.i][d.j] !== Units.None) {
                    for (
                        let iter = 0;
                        iter < this.capValue2 * this.ratio;
                        iter++
                    ) {
                        options.push(d);
                    }
                }
            }
        }
        if (options.length > 0) {
            const indexChoice = Math.floor(Math.random() * options.length);
            const choice = options[indexChoice];
            if (this.pieces[choice.i][choice.j] !== Units.None) {
                this.heatmap2[choice.i][choice.j] += 1;
            }
            this.pieces[choice.i][choice.j] = this.pieces[src.i][src.j];
            this.pieces[src.i][src.j] = Units.None;
            if (this.board[choice.i][choice.j] === Terrain.Flat) {
                movementsLeft--;
            }
            if (movementsLeft > 1) {
                this.infantry2(choice, movementsLeft - 1);
            }
        }
    }

    private antitank2(src: any, movementsLeft: number): void {
        // console.log('2');
        const dests = this.getAdjacentSqs(src);
        const options = [];
        for (const d of dests) {
            if (
                d.i < 8 &&
                d.i > -1 &&
                d.j < 8 &&
                d.j > -1 &&
                this.board[d.i][d.j] !== Terrain.Mountain &&
                (this.pieces[d.i][d.j] === Units.None ||
                    this.pieces[d.i][d.j] === Units.Anti_Tank1 ||
                    this.pieces[d.i][d.j] === Units.Tank1)
            ) {
                options.push(d);
                // incentivize center
                if ((d.i === 4 || d.i === 3) && (d.j === 4 || d.j === 3)) {
                    for (let iter = 0; iter < this.capValue2; iter++) {
                        options.push(d);
                    }
                }
                if (d.i >= 2 && d.i <= 5 && d.j >= 2 && d.j <= 5) {
                    for (let iter = 0; iter < this.capValue2; iter++) {
                        options.push(d);
                    }
                }
                // incentivize capture
                if (this.pieces[d.i][d.j] !== Units.None) {
                    for (
                        let iter = 0;
                        iter < this.capValue2 * this.ratio;
                        iter++
                    ) {
                        options.push(d);
                    }
                }
            }
        }
        if (options.length > 0) {
            const indexChoice = Math.floor(Math.random() * options.length);
            const choice = options[indexChoice];
            if (this.pieces[choice.i][choice.j] !== Units.None) {
                this.heatmap2[choice.i][choice.j] += 1;
            }
            this.pieces[choice.i][choice.j] = this.pieces[src.i][src.j];
            this.pieces[src.i][src.j] = Units.None;
            if (this.board[choice.i][choice.j] === Terrain.Flat) {
                movementsLeft--;
            }
            if (movementsLeft > 1) {
                this.antitank2(choice, movementsLeft - 1);
            }
        }
    }

    private tank2(src: any, movementsLeft: number): void {
        // console.log('2');
        const dests = this.getAdjacentSqs(src);
        const options = [];
        for (const d of dests) {
            if (
                d.i < 8 &&
                d.i > -1 &&
                d.j < 8 &&
                d.j > -1 &&
                this.board[d.i][d.j] !== Terrain.Mountain &&
                (this.pieces[d.i][d.j] === Units.None ||
                    this.pieces[d.i][d.j] === Units.Tank1 ||
                    this.pieces[d.i][d.j] === Units.Infantry1)
            ) {
                options.push(d);
                // incentivize center
                if ((d.i === 4 || d.i === 3) && (d.j === 4 || d.j === 3)) {
                    for (let iter = 0; iter < this.capValue2; iter++) {
                        options.push(d);
                    }
                }
                if (d.i >= 2 && d.i <= 5 && d.j >= 2 && d.j <= 5) {
                    for (let iter = 0; iter < this.capValue2; iter++) {
                        options.push(d);
                    }
                }
                // incentivize capture
                if (this.pieces[d.i][d.j] !== Units.None) {
                    for (
                        let iter = 0;
                        iter < this.capValue2 * this.ratio;
                        iter++
                    ) {
                        options.push(d);
                    }
                }
            }
        }
        if (options.length > 0) {
            const indexChoice = Math.floor(Math.random() * options.length);
            const choice = options[indexChoice];
            if (this.pieces[choice.i][choice.j] !== Units.None) {
                this.heatmap2[choice.i][choice.j] += 1;
            }
            this.pieces[choice.i][choice.j] = this.pieces[src.i][src.j];
            this.pieces[src.i][src.j] = Units.None;
            if (this.board[choice.i][choice.j] === Terrain.Flat) {
                movementsLeft--;
            }
            if (movementsLeft > 1) {
                this.tank2(choice, movementsLeft - 1);
            }
        }
    }

    private getAdjacentSqs(src: any): any {
        return [
            { i: src.i, j: src.j - 1 },
            { i: src.i, j: src.j + 1 },
            { i: src.i - 1, j: src.j },
            { i: src.i + 1, j: src.j }
        ];
    }
}
