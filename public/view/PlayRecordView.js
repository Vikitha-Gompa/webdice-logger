import {currentUser} from "../controller/firebase_auth.js";
import { AbstractView } from "./AbstractView.js";
import { startSpinner, stopSpinner } from "./util.js";

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

        //load play records from Firestore
        startSpinner();
        try{
            const allPlayRecords = await this.controller.loadPlayRecords();
            this.controller.model.playRecords = allPlayRecords;
            stopSpinner();

        }catch(e){
            stopSpinner();
            console.error('Error loading play records: ', e);
            alert('Error loading play records: ' + e);
            this.controller.model.playRecords = null;

        }
    }

    async updateView(){
        console.log('ProfileView.updateView() called');
        const viewWrapper = document.createElement('div');
        viewWrapper.innerHTML=  JSON.stringify(this.controller.model.playRecords);
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