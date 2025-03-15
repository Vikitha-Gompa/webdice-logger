import { PlayRecordModel } from "../model/PlayRecordModel.js";
import { startSpinner, stopSpinner } from "../view/util.js";
import { deletePlayRecords, getPlayRecordList } from "./firestore_controller.js";
import { ProfileController } from "./ProfileController.js";

export class PlayRecordController {
    view = null;
    model = null;
    constructor() {
        this.model = new PlayRecordModel();
        this.onClickClearButton = this.onClickClearButton.bind(this);
    }

    setView(view) {
        this.view = view;
    }
    async onClickClearButton() {
        if (!confirm("Are you sure to delete all game histroy?")) return null;
        startSpinner();
        try {
            await deletePlayRecords();
            stopSpinner();
           this.model.playRecords = [];

        } catch (e) {
            stopSpinner();
            console.error('Error deleteing Play Records: ', e);
            alert('Error deleteing play records:' + e);
        }
        this.view.render();
    }
    async loadPlayRecords() {
        startSpinner();
        try {
            const records = await getPlayRecordList();
            stopSpinner();
            return records;

        } catch (e) {
            stopSpinner();
            console.error('Error loading Play Records: ', e);
            alert('Error loading play records:' + e);
            return null;
        }
    }
}

