import { currentUser } from "../controller/firebase_auth.js";
import { AbstractView } from "./AbstractView.js";
import { startSpinner, stopSpinner } from "./util.js";
import { GamePlayStrategy, marking } from "../model/HomeModel.js";

export class PlayRecordView extends AbstractView {
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
        console.log('PlayRecordView.onMount called ');

        //load play records from Firestore
        startSpinner();
        try {
            const allPlayRecords = await this.controller.loadPlayRecords();
            this.controller.model.playRecords = allPlayRecords;
            stopSpinner();

        } catch (e) {
            stopSpinner();
            console.error('Error loading play records: ', e);
            alert('Error loading play records: ' + e);
        }
    }

    async updateView() {
        console.log('ProfileView.updateView() called');
        const viewWrapper = document.createElement('div');
        const response = await fetch('/view/templates/playrecord.html'); { cache: 'no-store' };
        viewWrapper.innerHTML = await response.text();

        const clear = viewWrapper.querySelector('button');
        clear.onclick = this.controller.onClickClearButton;

        const playRecords = this.controller.model.playRecords;
        const playRecordMain = viewWrapper.querySelector('table');
        this.createTableHeader(playRecordMain);
        const tbody = viewWrapper.querySelector('tbody');

        clear.disabled = true;
        if (playRecords == null || playRecords.length == 0) {
            tbody.innerHTML = `<tr>
    <td colspan="6" class="text-danger text-left"><strong>No play history found!</strong></td>
</tr>`;
        } else {
            clear.disabled = false;



            let i = 0;
            for (const record of playRecords) {
                const recordView = this.buildCollapsibleRecord(record, ++i);
                tbody.appendChild(recordView);
            }
            playRecordMain.appendChild(tbody);
        }


        return viewWrapper;
    }

    buildCollapsibleRecord(record, i) {
        const tr = document.createElement('tr');
        const date = (new Date(record.timestamp).toLocaleString())
        tr.innerHTML = "<td>" + i + "</td>" + "<td>" + record.bet + "</td>" + "<td>" + record.win + "</td>" + "<td>" + record.balance + "</td>" + "<td>" + date + "<td>"

        return tr;
    }

    attachEvents() {
        console.log('PlayRecordview.attachEvents() called');
        // document.getElementsByTagName("button")[0]
    }

    async onLeave() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1> Access Denied</h1>';
            return;
        }
        console.log('PlayRecordView.onLeave() called');
    }

    createTableHeader(table) {
        // const table = document.getElementById('playRecordMain'); // Get the table element
        const thead = document.createElement('thead'); // Create the <thead> element
        const tr = document.createElement('tr'); // Create a row
        const tb = document.createElement('tbody');
        // const tb = document.createElement('th'); 

        // Define the column headers
        const headers = ["#", "Bet", "Won", "Balance", "Timestamp"];

        // Loop through headers and create <th> elements
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.setAttribute('scope', 'col');
            th.innerHTML = headerText;
            tr.appendChild(th);
        });

        // Append the row to the thead
        thead.appendChild(tr);

        // Append the thead to the table
        table.appendChild(thead);
        table.appendChild(tb);
    }

    // Call the function to create the table header




}