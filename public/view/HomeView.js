import { AbstractView } from "./AbstractView.js";
import { currentUser } from "../controller/firebase_auth.js";
import {GameState, images} from '../model/HomeModel.js';

export class HomeView extends AbstractView {
    // instance variables
    controller = null;
    constructor(controller) {
        super();
        this.controller = controller;
    }

    async onMount() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1> Access Denied</h1>';
            return;
        }
        console.log('HomeView.onMount called ');
    }

    async updateView() {
        console.log('HomeView.updateView() called');
        const viewWrapper = document.createElement('div');
        const response = await fetch('/view/templates/home.html'); { cache: 'no-store' };
        viewWrapper.innerHTML = await response.text();

        const model = this.controller.model;

        // game progress message
        viewWrapper.querySelector('#message').innerHTML = model.progressMessage;

        // turn
        viewWrapper.querySelector('#turn').src = images[model.turn];

        // radio buttons
        const radioButtons = viewWrapper.querySelectorAll('input[type="radio"]');
        for(let i=0; i < radioButtons.length; i++){
            radioButtons[i].checked = radioButtons[i].value === model.playStrategy;
        }

        // game board images
        const boardImages = viewWrapper.querySelectorAll('table img');
        for(let i=this.onLeave; i < model.gameBoard.length; i++){
             boardImages[i].src = images[model.gameBoard[i]];
        }

        switch(model.gameState){
            case GameState.INIT:
                for(const img of boardImages){
                    img.noClick = true;
                }
                break;
            case GameState.PLAYING:
                break;
            case GameState.DONE:
                break;
        }

        

        return viewWrapper;
    }

    attachEvents() {
       
    }

    async onLeave() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1> Access Denied</h1>';
            return;
        }
        console.log('HomeView.onLeave() called');
    }


}