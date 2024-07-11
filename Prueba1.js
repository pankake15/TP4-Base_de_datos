// Endpoint para obtener todos los usuarios
app.get('/api/users', (req, res) => {
    // Supongamos que tienes un array de usuarios
    const users = [
      { id: 1, name: 'Usuario 1', email: 'usuario1@example.com' },
      { id: 2, name: 'Usuario 2', email: 'usuario2@example.com' },
      // Otros usuarios
    ];
  
    // Devuelve los usuarios como un objeto JSON
    res.json({ users: users });
  });