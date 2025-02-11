import { PlayRecordModel } from "../model/PlayRecordModel.js";

export class PlayRecordController{
    view = null;
    model = null;
    constructor(){
        this.model = new PlayRecordModel();
    }

    setView(view){
        this.view = view;
    }
}

