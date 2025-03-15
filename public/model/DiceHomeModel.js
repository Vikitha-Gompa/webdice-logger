

export const GameState = {
    INIT: 0, PLAYING: 1, DONE: 2
}

export const GamePlayStrategy = {
    VS_HUMAN: 'vsHuman', VS_RANDOM: 'vsRandom',
}

export class DiceHomeModel {


    gameState = GameState.INIT;
    progressMessage = ' Choose Bet(s) and press[PLAY]';
    betOnOddEven = 0;
    betOnRange = 0;
    balance = 0;
    even = false
    range = "1-2"
    key = 0;
    showKey = false;





    constructor() {
        this.balance = 100;
        this.generateKey()
    }




    generateKey() {
        this.key = Math.floor(Math.random() * 6)+1;
        // return this.key
    }

    getGameResult() {

        let total = this.getEvenOddAmount() + this.getRangeAmount();
        this.balance += total;
        return total

    }

    getEvenOddAmount() {

        if (this.betOnOddEven == 0) return 0;

        if (this.even && this.key % 2 == 0) return this.betOnOddEven * 2;

        if (!this.even && this.key % 2 == 1) return this.betOnOddEven * 2;

        return this.betOnOddEven * -1;
    }

    getRangeAmount() {

        if (this.betOnRange == 0) return 0;

        if (this.range == ("1-2") && this.key >= 1 && this.key <= 2) return this.betOnRange * 3;

        if (this.range == ("3-4") && this.key >= 3 && this.key <= 4) return this.betOnRange * 3;

        if (this.range == ("5-6") && this.key >= 5 && this.key <= 6) return this.betOnRange * 3;



        return (this.betOnRange * -1);
    }

    newGame() {
        // retain the play strategy
        this.gameState = GameState.INIT;
        this.progressMessage = ' Choose Bet(s) and press[PLAY]';
        this.betOnOddEven = 0;
        this.betOnRange = 0;
        this.even = false
        this.range = "1-2"
        this.generateKey()


    }


    reset() {
        this.newGame();
        this.balance = 0;
        this.gameState = GameState.INIT;
        // showKey = false;

        // this.progressMessage = 'Click New Game to start';
    }

    toFirestoreObject(email) {
        return {
            balance: this.balance,
            bet: this.betOnOddEven + this.betOnRange,
            email: email,
            timestamp: Date.now(),
            win: 0
        }
    }



}