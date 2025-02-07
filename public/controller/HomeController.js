import { GamePlayStrategy, GameState, HomeModel, marking } from "../model/HomeModel.js";
import {startSpinner, stopSpinner} from '../view/util.js';

export const glHomeModel= new HomeModel();

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class HomeController{
    // instance members
    model = null;
    view = null;

    constructor(){
        this.model = glHomeModel;
        this.onClickNewGameButton = this.onClickNewGameButton.bind(this);
        this.onChangeGameStrategy = this.onChangeGameStrategy.bind(this);
    }

    setView(view){
        this.view = view;
    }

    onClickNewGameButton(e){
        this.model.newGame();
        this.view.render();

    }

    async onClickBoardImages(index){
        this.model.move(index);
        this.model.winner = this.model.getGameResult();
        if(this.model.winner != null){
            this.gameOver();
        }
        else{
            this.model.changeTurn();
            this.model.progressMessage = `
               Click on the board to move. <br>
               (# of moves: ${this.model.moves})
            `;
        }
        this.view.render();

        // if vsRandom, computer makes a move
        if(this.model.winner == null && this.model.playStrategy == GamePlayStrategy.VS_RANDOM){
            const pos = this.model.computerMove();
            startSpinner();
            await sleep(1000);
            stopSpinner();
            this.model.move(pos);
            // check the game result again
            this.model.winner = this.model.getGameResult();
            if(this.model.winner != null){
                this.gameOver();
            } else{
                this.model.changeTurn();
                this.model.progressMessage = `
                Click on the board to move. <br>
                (# of moves: ${this.model.moves})
                `;
            }
            this.view.render();
        }
    }

    gameOver(){
        this.model.gameState = GameState.DONE;
        this.model.progressMessage = this.model.winner != marking.u ?
        `Game Over:  ${this.model.winner} wins` :
        `Game Over: It's a draw!`;
    }

    onChangeGameStrategy(e){
        this.model.playStrategy = e.target.value;
    }

   
}