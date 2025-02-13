export class PlayRecordModel{
    #playRecords = null;

    set playRecords(records){
        this.#playRecords = records;
    }

    get playRecords(){
        return this.#playRecords;
    }

    clear(){
        this.#playRecords = null;
    }

}