import { HomeModel } from "../model/HomeModel.js";

export class HomeController{
    // instance members
    model = null;
    view = null;

    constructor(){
        this.model = new HomeModel();
    }

    setView(view){
        this.view = view;
    }
}