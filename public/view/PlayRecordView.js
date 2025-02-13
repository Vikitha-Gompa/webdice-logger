import {currentUser} from "../controller/firebase_auth.js";
import { AbstractView } from "./AbstractView.js";
import { startSpinner, stopSpinner } from "./util.js";
import {GamePlayStrategy, marking} from "../model/HomeModel.js";

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
        const response = await fetch('/view/templates/playrecord.html'); { cache: 'no-store' };
        viewWrapper.innerHTML = await response.text();

        viewWrapper.querySelector('#player').textContent = 'Player:' + currentUser.email;
        const playRecords = this.controller.model.playRecords;
        const playRecordMain = viewWrapper.querySelector('#playRecordMain');
        if(playRecords == null){
            playRecordMain.innerHTML = '<h2>Error loading play records</h2>';
        } else if(playRecords.length == 0){
            playRecordMain.innerHTML = '<h2>No play records found</h2>';
        } else{
            for(const record of playRecords){
                const recordView = this.buildCollapsibleRecord(record);
                playRecordMain.appendChild(recordView);
            }
        }


        return viewWrapper;
    }

    buildCollapsibleRecord(record){
        const topDiv = document.createElement('div');
        topDiv.classList.add('mb-2');

        const a = document.createElement('a');
        a.classList.add('btn', 'btn-secondary', 'btn-sm');
        a.setAttribute('data-bs-toggle', 'collapse');
        a.href = `#record${record.docId}`;
        a.textContent = new Date(record.timestamp).toLocaleString();
        topDiv.appendChild(a);

        const collapseDiv = document.createElement('div');
        collapseDiv.classList.add('collapse');
        collapseDiv.id = `record${record.docId}`;
        collapseDiv.innerHTML = `
            <div class="card card-body">
               <p>Game Strategy: ${record.gameStrategy == GamePlayStrategy.VS_HUMAN ? 'Human vs. Human' : 'Human vs. Random'}</p>
               <p>Moves: ${record.moves}</p>
               <p>Winner: ${record.winner == marking.U ? 'Draw' : record.winner}</p>
            </div>
        `;
        topDiv.appendChild(collapseDiv);
        return topDiv;
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