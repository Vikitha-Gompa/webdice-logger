//import { HomeView } from "../view/HomeView.js";
//import { ProfileView } from "../view/ProfileView.js";
//import { HomeController } from "./HomeController.js";
//import { ProfileController } from "./ProfileController.js";

document.getElementById('appHeader').textContent = 'Cloud Web Template'
document.title = 'App Template' ;

const routes = {
    {path: '/', view: HomeView, controller: HomeController},
    {path: '/profile', view: ProfileView, controller: ProfileController}

};

