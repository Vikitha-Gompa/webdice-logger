export const marking ={
    X:'X', O: 'O', U:'U'
}

export const images = {
    X:'/images/x.png',
    O:'/images/o.png',
    U:'/images/u.png'
}

export const GameState ={
    INIT: 0, PLAYING: 1, DONE: 2
}

export const GamePlayStrategy ={
    VS_HUMAN: 'vsHuman', VS_RANDOM: 'vsRandom',
}

export class HomeModel {

    gameBoard; // 1D array with 9 elements
    gameState = GameState.INIT;
    winner = null; // X, O, U; null(playing)
    turn = marking.X; // x or O
    moves = 0;
    progressMessage = ' Click New Game to Start';
    playStrategy = GamePlayStrategy.VS_HUMAN; 

    // winning combinations
    winningCombinations =[
        [0,1,2], [3,4,5], [6,7,8], //rows
        [0,3,6], [1,4,7], [2,5,8], // columns
        [0,4,8], [2,4,6] // diagonals
    ];

    constructor(){
        // init game board
        this.gameBoard = Array(9).fill(marking.U);
    }

    move(pos){
        this.gameBoard[pos] = this.turn;
        this.moves++;
    }

    changeTurn(){
        this.turn = this.turn ===marking.X ? marking.O : marking.X;
    }

    getGameResult(){
        // check if there is a winner
        for( let i = 0; i < this.winningCombinations.length; i++){
            const [a,b,c] = this.winningCombinations[i];
            if(this.gameBoard[a] != marking.U && this.gameBoard[a] === this.gameBoard[b] && this.gameBoard[a] === this.gameBoard[c]){
                return this.gameBoard[a];
            }
        }

        // check for draw
        if(this.gameBoard.includes(marking.U) === false){
            return marking.U;
        }

        // no winner or draw yet
        return null;

    }

    newGame(){
        // retain the play strategy
        this.gameState = GameState.PLAYING;
        this.progressMessage = 'Click on the board to move.';
        this.winner = null;
        this.turn = marking.X;
        this.moves = 0;
        for(let i=0; i< this.gameBoard.length; i++){
            this.gameBoard[i] = marking.U;
        }
    }


    reset(){}



}