import { AbstractView } from "./AbstractView.js";
import { currentUser } from "../controller/firebase_auth.js";
import { GameState, images, marking } from '../model/HomeModel.js';

export class HomeView extends AbstractView {
    // instance variables
    controller = null;
    constructor(controller) {
        super();
        this.controller = controller;
        this.controller.loadExistingBalance();
    }

    async onMount() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1> Access Denied</h1>';
            return;
        }
        console.log('HomeView.onMount called ');
    }

    async updateView() {

        const viewWrapper = document.createElement('div');
        const response = await fetch('/view/templates/home.html'); { cache: 'no-store' };
        viewWrapper.innerHTML = await response.text();

        const model = this.controller.model;
        
        // game progress message
        viewWrapper.querySelector('#message').innerHTML = model.progressMessage;
        

        // this.controller.loadExistingBalance();

        viewWrapper.querySelector('#button-new-game').onclick
            = this.controller.onClickNewGameButton;
        const playbutton = viewWrapper.querySelector('#button-play-game');
        playbutton.onclick = this.controller.onClickPlayButton;
        playbutton.disabled = true;


        const diceFace = viewWrapper.querySelector("#diceValue");
        viewWrapper.querySelector("#balance").innerHTML = "Balance $" + model.balance;

        
        switch (model.gameState) {
            case GameState.INIT:
                
                this.disabledAllPlayOptions(viewWrapper, false);
                diceFace.innerHTML = "?";
                break;
            case GameState.DONE:
                this.disabledAllPlayOptions(viewWrapper, true);
                diceFace.innerHTML = model.key;

                break;

        }

        return viewWrapper;
    }

    attachEvents() {
        document.getElementById('button-new-game').onclick
            = this.controller.onClickNewGameButton;
        document.querySelector("#secretKeyCheckBox").onclick = this.controller.showKey;
        const radioButtonsR = document.querySelectorAll('#radioRange input[type="radio"]');
        const radioButtonsEO = document.querySelectorAll('#radioEvenOdd input[type="radio"]');

        for (let i = 0; i < radioButtonsR.length; i++) {
            radioButtonsR[i].onchange = this.controller.onChangeRadioButtons;
            if (i < radioButtonsEO.length) {
                radioButtonsEO[i].onchange = this.controller.onChangeRadioButtons;
            }
        }


        const betValuesonEO = document.querySelector('#EvenOddbetValue');
        const betValuesonR = document.querySelector('#RangebetValue');


        betValuesonEO.onchange = this.controller.updateBetValueForEvenOdd;
            
    
        betValuesonR.onchange = this.controller.updateBetValueForRange;
            
        


    }

    async onLeave() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1> Access Denied</h1>';
            return;
        }
        console.log('HomeView.onLeave() called');
    }

    disabledAllPlayOptions(viewWrapper, enable) {
        const radioButtonsR = viewWrapper.querySelectorAll('#radioRange input[type="radio"]');
        const radioButtonsEO = viewWrapper.querySelectorAll('#radioEvenOdd input[type="radio"]');
        const showKey = viewWrapper.querySelector("#secretKeyCheckBoxValue");
        for (let i = 0; i < radioButtonsR.length; i++) {
            radioButtonsR[i].disabled = enable;
            if (i < radioButtonsEO.length) {
                radioButtonsEO[i].disabled = enable;
            }
        }

        viewWrapper.querySelector('#EvenOddbetValue').disabled = enable;
        viewWrapper.querySelector('#RangebetValue').disabled = enable;
        viewWrapper.querySelector('#button-new-game').disabled = !enable;

        viewWrapper.querySelector("#secretKeyCheckBox").checked = this.controller.model.showKey;
        showKey.innerHTML = "Game Key: "+this.controller.model.key;
        if (this.controller.model.showKey) {
            showKey.classList.remove("d-none");
            
        }
        else {
            showKey.classList.add("d-none");
        }


    }

   

}