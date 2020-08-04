FROM node:8
# Utiliza la imagen de node 8 como base.
# A partir de esta imagen se ejecutarán los comandos de abajo creando una nueva imagen.

# Configura variables de entorno necesariar para correr node
ENV NODE_ENV=development
ENV DEBUG=true

# Crea un directorio y nos movemos ahí
WORKDIR /home/node/unqfy

# Copia el package.json package-lock.json en /home/node/unqfy
COPY package.json .
COPY package-lock.json .

# Ejecuta npm install. Esto produce que se instalen todas las dependencias necearias para correr la aplicación
RUN ["npm", "install"]

# Expone el puerto 5000 donde corre la aplicación
EXPOSE 5000

# Copia los fuentes dentro del container
COPY album.js /home/node/unqfy/
COPY apiExceptions.js /home/node/unqfy/
COPY apiRest.js /home/node/unqfy/
COPY artist.js /home/node/unqfy/
COPY generateSpotifyCredentials.js /home/node/unqfy/
COPY main.js /home/node/unqfy/
COPY monitorObserver.js /home/node/unqfy/
COPY musixMatchRequester.js /home/node/unqfy/
COPY observable.js /home/node/unqfy/
COPY observer.js /home/node/unqfy/
COPY playlist.js /home/node/unqfy/
COPY spotifyCreds.json /home/node/unqfy/
COPY spotifyRequester.js /home/node/unqfy/
COPY test.js /home/node/unqfy/
COPY track.js /home/node/unqfy/
COPY unqfy.js /home/node/unqfy/



# Le da permisos al usuario node para escribir en /home/node/unqfy
# Como comentario, notar que el comando RUN nos permite ejecutar culquier comando bash valido.
RUN chown node:users /home/node/unqfy

# Habilita el usuario node. Por defecto, los containers corren los comandos con el usuario root
USER node

# Comando por defecto sino se provee uno al hacer docker run
# El comando corre el servicio
CMD [ "node", "apiRest" ]

# LISTO!


# Para construir la imagen
# docker build -t <nombre_de_la_imagen> .

# Para correr el container
# docker run -p 5000:5000 --name <nombre_container> --user node <nombre_de_la_imagen>