const fs = require('fs');
const promisify = require('util').promisify;
const {google} = require('googleapis');
const getGmailClient = require('./gmailClient');


// Obtiene un objeto JJJJJ a partir del credentials.json y token.json
const gmailClient = getGmailClient();

// Envia un mail, utilizando la funcion ZZZZ que termina haciendo un request a XXXXX
class MailSender{

  constructor(){

  }
  static sendMail(subject3,email,mensaje){
    gmailClient.users.messages.send(
      {
        userId: 'me',
        requestBody: {
          raw: createMessage(subject3,email,mensaje),
        },
      }
    );
    
  }
}
  function createMessage(subject2,email, mensaje) {
      // You can use UTF-8 encoding for the subject using the method below.
      // You can also just use a plain string if you don't need anything fancy.
      const subject = subject2;
      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
      const messageParts = [
        'From: UNQfy Grupo 4 <unqfyg4@gmail.com>',
        'To:' + '<' + email +  '>',
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        '' + mensaje ,
        'Gracias por elegir UNQfy',
      ];
      const message = messageParts.join('\n');
    
      // The body needs to be base64url encoded.
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    
      return encodedMessage;
  }



module.exports = {
  MailSender,
};
/* createMessage("ivanjaratamargo@gmail.com","HOOLAAA"); */