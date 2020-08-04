 // define a class
class Observable {
    // each instance of the Observer class
    // starts with an empty array of things (observers)
    // that react to a state change
    constructor() {
        this.observers = [];
        //this.monitorObservers = [];
    }
    
    // add the ability to subscribe to a new object / DOM element
    // essentially, add something to the observers array
    subscribe(f) {
        this.observers.push(f);
        console.log("se ha suscrito" + f);
    }
    
    // add the ability to unsubscribe from a particular object
    // essentially, remove something from the observers array
    unsubscribe(f) {
        this.observers = this.observers.filter(subscriber => subscriber !== f);
    }

 /*    subscribeMonitor(f) {
        this.monitorObservers.push(f);
        console.log("se ha suscrito al monitor" + f);
    }
    
    // add the ability to unsubscribe from a particular object
    // essentially, remove something from the observers array
    unsubscribeMonitor(f) {
        this.monitorObservers = this.monitorObservers.filter(subscriber => subscriber !== f);
    }

    notifyMonitor(name,id,albumName,loggingPhrase) {
        this.monitorObservers.forEach(function (observer) {
            observer.update(name,id,albumName,loggingPhrase);
            //console.log("Se agrego un album de " + name);
        });
      } */
    
    // update all subscribed objects / DOM elements
    // and pass some data to each of them
    /* notify(data) {
        this.observers.forEach(observer => observer(data));
    } */
 /*    notify(name) {
        this.observers.forEach(function (observer) {
            observer.update("El Artista " + name + " agrego un nuevo Album");
            //console.log("Se agrego un album de " + name);
        });
    } */
}

module.exports = {
    Observable,
    };