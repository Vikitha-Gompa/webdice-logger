import { HomeModel } from "../model/HomeModel.js";

export const glHomeModel= new HomeModel();

export class HomeController{
    // instance members
    model = null;
    view = null;

    constructor(){
        this.model = glHomeModel;
    }

    setView(view){
        this.view = view;
    }

   
}