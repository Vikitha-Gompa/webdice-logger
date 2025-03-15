import { DiceHomeModel } from "../model/DiceHomeModel.js";
import { GamePlayStrategy, GameState, HomeModel, marking } from "../model/HomeModel.js";
import { startSpinner, stopSpinner } from '../view/util.js';
import { currentUser } from "./firebase_auth.js";
import { addPlayRecord, getPlayRecordList } from "./firestore_controller.js";

export const glHomeModel = new DiceHomeModel();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class HomeController1 {
    // instance members
    model = null;
    view = null;

    constructor() {
        this.model = glHomeModel;
        this.onClickNewGameButton = this.onClickNewGameButton.bind(this);
        this.onClickPlayButton = this.onClickPlayButton.bind(this);
        this.updateBetValueForRange = this.updateBetValueForRange.bind(this);
        this.updateBetValueForEvenOdd = this.updateBetValueForEvenOdd.bind(this);
        this.onChangeRadioButtons = this.onChangeRadioButtons.bind(this);
        this.showKey = this.showKey.bind(this);
        this.loadExistingBalance = this.loadExistingBalance.bind(this);
        // this.validatePlayButton = this.validatePlayButton.bind(this);
        // this.loadExistingBalance();

    }

    setView(view) {
        this.view = view;
    }

    onClickNewGameButton(e) {
        this.model.newGame();
        this.view.render();

    }
    updateBetValueForRange(e) {

        let value = e.target.value == "" ? 0 : parseInt(e.target.value);
        this.model.betOnRange = value;
        document.getElementById("button-play-game").disabled = ((this.model.betOnOddEven == 0) && (this.model.betOnRange == 0))

    }
    updateBetValueForEvenOdd(e) {
        let value = e.target.value == "" ? 0 : parseInt(e.target.value);
        this.model.betOnOddEven = value;
        document.getElementById("button-play-game").disabled = ((this.model.betOnOddEven == 0) && (this.model.betOnRange == 0))

    }

    async onClickPlayButton(e) {


        this.model.getGameResult();




        let winonEO = this.model.getEvenOddAmount();
        let winonR = this.model.getRangeAmount();
        this.model.progressMessage = "";
        if (winonEO == 0) {
            this.model.progressMessage = "No bet on Even/ Odd";
        }
        else if (winonEO < 0) {
            if (this.model.even) {
                this.model.progressMessage = "You lost  $" + (winonEO * -1) + " on even"
            }
            else {
                this.model.progressMessage = "You lost $" + (winonEO * -1) + " on odd"
            }
        }
        else {
            if (this.model.even) {
                this.model.progressMessage = "You won $" + winonEO + " on even"
            }
            else {
                this.model.progressMessage = "You won  $" + winonEO + " on odd"
            }
        }
        this.model.progressMessage += "<br>";

        if (winonR == 0) {
            this.model.progressMessage += "No bet on range";
        }
        else if (winonR < 0) {

            this.model.progressMessage += "You lost  $" + (winonR * -1) + " on range " + this.model.range;


        }
        else {
            this.model.progressMessage += "You won  $" + (winonR) + " on range " + this.model.range;
        }



        //save the game record to Firestore
        startSpinner();
        try {
            const record = this.model.toFirestoreObject(currentUser.email);
            record.win = winonEO + winonR;
            await addPlayRecord(record);
            stopSpinner();
        } catch (e) {
            stopSpinner();
            console.error('Enter saving game record: ', e);
            alert('Error saving game record: ' + e);
        }





        this.model.gameState = GameState.DONE;


        this.view.render();

    }

    onChangeRadioButtons(e) {
        let name = e.target.name;
        if (name === "evenbetType") {
            this.model.even = true;
            document.getElementById("odd").checked = false;
        }
        else if (name === "oddbetType") {
            this.model.even = false;
            document.getElementById("even").checked = false
        }
        else {
            this.model.range = name.replaceAll("betType", "");
            for (let i of ["1-2", "3-4", "5-6"]) {
                if (i === this.model.range) {
                    continue;
                }
                document.getElementById(i).checked = false
            }
        }

    }
    showKey(e) {

        e.target.nextElementSibling.innerHTML = "Game Key: " + this.model.key;
        if (e.target.checked) {
            e.target.nextElementSibling.classList.remove("d-none");
            this.model.showKey = true;
        }
        else {
            e.target.nextElementSibling.classList.add("d-none");
            this.model.showKey = false;
        }
    }

    async onClickBoardImages(index) {
        this.model.move(index);
        this.model.winner = this.model.getGameResult();
        if (this.model.winner != null) {
            this.gameOver();
        }
        else {
            this.model.changeTurn();
            this.model.progressMessage = `
               Click on the board to move. <br>
               (# of moves: ${this.model.moves})
            `;
        }
        this.view.render();

        // if vsRandom, computer makes a move
        if (this.model.winner == null && this.model.playStrategy == GamePlayStrategy.VS_RANDOM) {
            const pos = this.model.computerMove();
            startSpinner();
            await sleep(1000);
            stopSpinner();
            this.model.move(pos);
            // check the game result again
            this.model.winner = this.model.getGameResult();
            if (this.model.winner != null) {
                this.gameOver();
            } else {
                this.model.changeTurn();
                this.model.progressMessage = `
                Click on the board to move. <br>
                (# of moves: ${this.model.moves})
                `;
            }
            this.view.render();
        }
    }

    async gameOver() {
        this.model.gameState = GameState.DONE;
        decisionOnEvenOdd = this.model.getEvenOddAmount() < 0 ? "lost" : "won";
        decisionOnRange = this.model.getRangeAmount() < 0 ? "lost" : "won";
        place = this.model.even ? "even" : "odd";
        this.model.progressMessage = `You :  ${decisionOnEvenOdd} on ${place} <br> You ${decisionOnRange} on ${this.model.range}`;

        //save the game record to Firestore
        // startSpinner();
        // try{
        //  const record = this.model.toFirestoreObject(currentUser.email);
        //  await addPlayRecord(record);
        //  stopSpinner();
        // }catch(e){
        //     stopSpinner();
        //     console.error('Enter saving game record: ', e);
        //     alert('Error saving game record: '+ e);
        // }
    }

    onChangeGameStrategy(e) {
        this.model.playStrategy = e.target.value;
    }

    async loadExistingBalance() {
        startSpinner();
        try {
            let records = await getPlayRecordList();
            stopSpinner();
            if (records.length > 0)
                this.model.balance = records[0].balance;
            else
                this.model.balance =100;


        } catch (e) {
            stopSpinner();
            // console.error('Enter saving game record: ', e);
            // alert('Error saving game record: ' + e);
        }
        // loadPlayRecords();
        this.view.render();

    }


}