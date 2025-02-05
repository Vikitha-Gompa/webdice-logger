import { HomeModel } from "../model/HomeModel.js";

export const glHomeModel= new HomeModel();

export class HomeController{
    // instance members
    model = null;
    view = null;

    constructor(){
        this.model = glHomeModel;
        this.onClickNewGameButton = this.onClickNewGameButton.bind(this);
    }

    setView(view){
        this.view = view;
    }

    onClickNewGameButton(e){
        console.log('HomeController.onClickNewGAmeButton() called');
        this.model.newGame();
        this.view.render();

    }

    onClickBoardImages(index){
        console.log('HomeController.onClickBoardImages() called', index);
    }

    onChangeGameStrategy(e){
        console.log('HomeController.onChangeGameStrategy() called', e.target.value);
        this.model
    }

   
}