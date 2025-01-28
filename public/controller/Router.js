export class Router{
    //instance members
    routes = null;
    currentView = null;

    constructor(routes){
        this.routes = routes;
        const path = window.location.pathname;

    }

    async naviate(path){
        await this.#loadRoute(path);
    }

    async #loadRoute(path){
        let matchRoute = this.routes.find(route => route.path === path);
        if (!matchRoute){
            console.error('Route not found for path:',path);
            matchRoute = this.routes[0];
            window.location.pathname = matchRoute.path;
        }

        const controller = new matchRoute.controller();
        const view = new matchRoute.view(controller);
        controller.setView(view);

        //view lifecycle methods
        if(this.currentView){
            await this.currentView.onLeave();
        }
        this.currentView = view;
        await view.onMount();
        await view.render();
    }

}