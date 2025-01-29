import { currentUser } from "../controller/firebase_auth.js";

// common super class for all view classes
export class AbstractView {

    parentElement = document.getElementById('spaRoot');

    constructor() {
        if (new.target == AbstractView) {
            throw new Error('Cannot instantiate AbstractView directly');
        }
    }

    // called when the view is mounted to the DOM
    // fetch intial data from resources (e.g DB, API) update the model
    async onMount() {
        throw new Error('onMount method must be implemented');
    }

    // to update view to reflect the updated model
    async render() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1> Access Denied</h1>';
            return;
        }
        this.parentElement.innerHTML = '';
        // update view to updated model
        const elements = await this.updateView();
        //render the update view
        this.parentElement.append(elements);
        // add event listeners
        this.attachEvents();

    }

    async updateView() {
        throw new Error('updateView method must be implemented');
    }

    async attachEvents() {
        throw new Error('attachEvents method must be implemented');
    }

    // called when the view is unmounted fromm the DOM
    async onLeave() {
        throw new Error('onLeave method must be implemented');
    }
}