import { HomeView } from "../view/HomeView.js";
import { ProfileView } from "../view/ProfileView.js";
import { HomeController1 } from "./HomeController1.js";
import { ProfileController } from "./ProfileController.js";
import { Router } from "./Router.js";
import {createAccount, loginFirebase, logoutFirebase} from './firebase_auth.js';
import { startSpinner, stopSpinner } from "../view/util.js";
import { PlayRecordView } from "../view/PlayRecordView.js";
import { PlayRecordController } from "./PlayRecordController.js";
//import{} from "../view/templates/home.html";


document.getElementById('appHeader').textContent = 'Dice Roll Game';
document.title = 'Dice Roll Game' ;


const routes =  [
    {path: '/', view: HomeView, controller: HomeController1},
    {path: '/playrecord', view: PlayRecordView, controller: PlayRecordController },
    {path: '/profile', view: ProfileView, controller: ProfileController}
];

// create an instance of Router
export const router = new Router(routes);
router.navigate(window.location.pathname);

const menuItems = document.querySelectorAll('a[data-path]');
menuItems.forEach(item => {
    item.onclick = function(e) {
        const path = item.getAttribute('data-path');
        router.navigate(path);
    }
});

// login form event listener
document.forms.loginForm.onsubmit = async function(e){
    e.preventDefault();  // prevent from page reload
    const email = e.target.email.value;
    const password = e.target.password.value;
    startSpinner();
    try {
        await loginFirebase(email, password);
        stopSpinner();
        localStorage.setItem('loggedInUser', email);
        document.getElementById('userinfo').classList.add('d-none'); // Hide login form
        console.log('User logged in', email);
        document.getElementById('loginInfo').innerHTML = email;
        // document.getElementById('navMenuContainer').classList.remove('d-none'); // Show menu after login
        
    } catch(e){
        stopSpinner();
        console.error('Error logging in:',e);
        //const errorCode = e.code;
        //const errorMessage = e.message;
        alert('Sign in failed: '+ e.code + ',' + e.message);

    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('loggedInUser');

    if (savedUser) {
        document.getElementById('userinfo').classList.add('d-none'); // Hide login button
        document.getElementById('loginInfo').innerHTML = savedUser;  // Show logged-in email
    } else {
        document.getElementById('userinfo').classList.remove('d-none'); // Show login button
        document.getElementById('loginInfo').innerHTML = 'No User';
    }
});

// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById('loginInfo').textContent = email;
// });



//logout button
document.getElementById('logoutButton').onclick= async function(e){
    startSpinner();
    try{
        await logoutFirebase();
        stopSpinner();
        localStorage.removeItem('loggedInUser');
        document.getElementById('userinfo').classList.remove('d-none'); // Hide login form
        console.log('User logged out');
    } catch(e){
        stopSpinner();
        console.error('Error looging out:', e);
        const errorCode = e.code;
        const errorMessage = e.message;
        alert('Sign out failed: '+ e.code + ',' + e.message);

    }
}

//create account event
document.forms.createAccountForm.onsubmit = async function(e){
    e.preventDefault(); //prevent from page reload
    const email = e.target.email.value;
    const emailConfirm = e.target.emailConfirm.value;
    if(email !== emailConfirm){
        alert('Emails do not match');
        return;
    }
    const password = e.target.password.value;
    startSpinner();
    try{
        await createAccount(email, password);
        stopSpinner();
        console.log('user account created', email);
        document.getElementById('createAccountDiv').classList.replace('d-block', 'd-none');

    }catch(e){
        stopSpinner();
        console.error('Error creating account:', e);
        const errorCode = e.code;
        const errorMessage = e.message;
        alert('create account failed:', +e.code + ','+e.message);
    }
}

//show create account form / hide login form
document.getElementById('goToCreateAccount').onclick = function(e){
    document.getElementById('loginDiv').classList.replace('d-block', 'd-none');
    document.getElementById('createAccountDiv').classList.replace('d-none', 'd-block');
    document.forms.createAccountForm.reset();
}

//hide create account form / show login form

document.getElementById('goToLogin').onclick = function(e){

    document.getElementById('loginDiv').classList.replace('d-none', 'd-block');

    document.getElementById('createAccountDiv').classList.replace('d-block', 'd-none');
}