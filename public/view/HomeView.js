import { AbstractView } from "./AbstractView.js";

export class HomeView extends AbstractView{
    // instance variables
    controller = null;
    constructor(controller){
        super();
        this.controller = controller;
    }

    async onMount(){
        console.log('HomeView.onMount called ');
    }

    async updateView(){
        console.log('HomeView.updateView() called');
        const div = document.createElement('div');
        div.innerHTML = 'Home View';
        return div;
    }

    attachEvents(){
        console.log('HomeView.attachEvents() called');
    }

    async onLeave(){
        console.log('HomeView.onLeave() called');
    }


}