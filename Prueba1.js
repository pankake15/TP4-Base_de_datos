const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 2000;

// Allow all cross-origin requests
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());
// Nuestra aplicación esta lista para recibir peticiones

app.get('/', (req, res) => { 
   console.log(__dirname)
   try{
    res.sendFile(path.join(__dirname, 'index.html')); 
     } catch(e){
     res.status(500).send({'error': 'Internal server error'})
     }}); 


// Creamos dos arreglos en donde almacenaremos los mails y los u
const usuarios = Array()
const mails = Array()
app.post('/', (req, res) => {

// Guardamos el usuario y el email que venian en el Json
const {usuario, email} = req.body;
// Guardamos el usuario en el arreglo de usuarios.
usuarios.push(usuario)
mails.push(email)
// Imprimimos los arrays para ver si se estan agregando
console.log(usuarios)
console.log(mails)
// Devolvemos un codigo de respuesta 201 indicando que e
// junto con el usuario y el mail que fueron recibidos.
res.status(201).send({usuario,email})

});

app.get('/hola', (req, res) => { 
  console.log(__dirname)
    try{  
      const Imprimir = [
        {usuario:"usuario",
        email: "email"
      }
      ]
     res.json(Imprimir)
    
      } catch(e){
      res.status(500).send({'error': 'Internal server error'})
      }}); 

app.listen(port, () => { 
 console.log(`Server is running on http://localhost: ${port}`);
 }); 

 const pgp = require('pg-promise')();
 const db = pgp('postgresql://tp_base_de_datos_arqr_user:ogjOnQckRCo9QT8nKRyxCizI3zrHH00E@dpg-cq7vuajv2p9s73cckahg-a.oregon-postgres.render.com/tp_base_de_datos_arqr');
 
 // Endpoint para obtener usuarios desde PostgreSQL
 app.get('/api/users', async (req, res) => {
   try {
     const users = await db.any('SELECT * FROM users');
     res.json({ users });
   } catch (error) {
     res.status(500).json({ error: 'Error al obtener usuarios' });
   }
 });

 app.post('/users', async (req, res) => {
    try {
      const newUser = await db.one('INSERT INTO users(name, email) VALUES($1, $2) RETURNING *', [req.body.name, req.body.email]);
      res.json({ newUser });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  });