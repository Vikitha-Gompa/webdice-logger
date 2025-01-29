import { AbstractView } from "./AbstractView.js";
import { currentUser } from "../controller/firebase_auth.js";


export class ProfileView extends AbstractView{
    // install variables
    controller = null;
    constructor(controller){
        super();
        this.controller = controller ;
    }

    async onMount(){
        console.log('ProfileView.onMount called ');
    }

    async updateView(){
        console.log('ProfileView.updateView() called');
        const viewWrapper = document.createElement('div');
        viewWrapper.innerHTML= `
            <h1>Profile </h1>
            <p> Welcome to your profile page. </p>
            <p> Email: ${currentUser.email}</p>
            <p> User UID ${currentUser.uid}</p> 
        `;
        return viewWrapper;
    }

    async attachEvents(){
        console.log('ProfileView.attachEvents() called');
    }

    async onLeave(){
        console.log('ProfileView.onLeave() called');
    }


}