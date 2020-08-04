const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const sendMailMod = require('./send-mail-example/sendMail.js');


class NotificationService {
    constructor() {
      this.suscriptors =  [];     
    }
    suscribe(artistId,email) {   
        //caso nueva suscripcion    
        if(this.suscriptors.find(s=> s.getArtistId() == artistId) === undefined){
            let susc =new Suscription(artistId);
            susc.add(email);
            this.suscriptors.push(susc);
            console.log("Se suscribio: "+ email + " al artista con el id: " + artistId);
            this.imprimirTodosLosSuscriptores();
        }else {
            let susc = this.suscriptors.find(s=> s.getArtistId() == artistId);
            susc.add(email);
            console.log("Se suscribio: "+ email + " al artista con el id: " + artistId);
            this.imprimirTodosLosSuscriptores();
        }
        
        return this;
    }

    unsuscribe(artistId,email){
        let susc = this.suscriptors.find(s=> s.getArtistId() == artistId);
        susc.delete(email)
        console.log("Se borro la suscripcion del: "+ email + " al artista con el id: " + artistId);
        this.imprimirTodosLosSuscriptores();
    }

    getSuscriptorsEMAILSForArtistId(artistId){
        if(this.suscriptors.length == 0){
            console.log("Nadie se suscribio a este artista aun");
            return [];
        }
        let suscriptionsOfArtistId = this.suscriptors.find(s=> s.getArtistId() == artistId);
        console.log("Los suscriptores para el artista con id " + artistId + " son: ");
        console.log(suscriptionsOfArtistId);
        return suscriptionsOfArtistId.getEmails();
    }
    deleteSuscriptorsForArtistId(artistId){
        this.suscriptors = this.suscriptors.filter(s=> s.getArtistId() !== artistId);
        console.log("Los suscriptores para el artista con id " + artistId + " fueron eliminados ");
        this.imprimirTodosLosSuscriptores();
    }

    notify(artistId,subject4,message){
        let suscriptors = this.getSuscriptorsEMAILSForArtistId(artistId);
        suscriptors.forEach(e=> sendMailMod.MailSender.sendMail(subject4,e,message));
    }
    
    imprimirTodosLosSuscriptores(){
        console.log("Los suscriptores actuales son: ");
        console.log(this.suscriptors);
    }

    save(filename) {
        const listenersBkp = this.listeners;
        this.listeners = [];
    
        const serializedData = picklify.picklify(this);
        this.listeners = listenersBkp;
        fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
      }
    
      static load(filename) {
        const serializedData = fs.readFileSync(filename, {
          encoding: 'utf-8'
        });
        //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
        const classes = [NotificationService, Suscription];
        return picklify.unpicklify(JSON.parse(serializedData), classes);
      }

}

class Suscription{

    constructor(id){
        this.artistId = id;
        this.emails = [];
    }

    add(email){
        if(! this.emails.includes(email)){
            this.emails.push(email);
        }
    }
    delete(email){
        this.emails = this.emails.filter(e=> e !== email);
    }

    getEmails(){
        return this.emails;
    }

    getArtistId(){
        return this.artistId;
    }
}


module.exports = {
    NotificationService,Suscription,
};