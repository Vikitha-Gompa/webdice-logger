import {currentUser} from "../controller/firebase_auth.js";
import { AbstractView } from "./AbstractView.js";

export class PlayRecordView extends AbstractView{
    controller = null;
    constructor(controller){
        super();
        this.controller = controller;

    }

    async onMount() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1> Access Denied</h1>';
            return;
        }
        console.log('PlayRecordView.onMount called ');
    }

    async updateView(){
        console.log('ProfileView.updateView() called');
        const viewWrapper = document.createElement('div');
        viewWrapper.innerHTML= `
            <h1>Play Record </h1>
        `;
        return viewWrapper;
    }

    attachEvents(){
        console.log('PlayRecordview.attachEvents() called');
    }

    async onLeave() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1> Access Denied</h1>';
            return;
        }
        console.log('PlayRecordView.onLeave() called');
    }


}