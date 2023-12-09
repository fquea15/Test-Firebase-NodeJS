// app.js
const express = require('express');
const firebase = require('firebase');

const app = express();

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAr8tcp0mNW5H3-zJheRm8ldd5nND4ep94",
    authDomain: "delishdecider-f1611.firebaseapp.com",
    databaseURL: "https://delishdecider-f1611-default-rtdb.firebaseio.com",
    projectId: "delishdecider-f1611",
    storageBucket: "delishdecider-f1611.appspot.com",
    messagingSenderId: "686213277184",
    appId: "1:686213277184:web:8a4aed0467e58f8663dae5",
    measurementId: "G-7PBQBHJZX1"
};

firebase.initializeApp(firebaseConfig);

// Rutas CRUD
app.use(express.json());

// Create (POST)
app.post('/api/items', async (req, res) => {
  try {
    const newItem = req.body;
    const newItemRef = await firebase.database().ref('/items').push(newItem);
    res.json({ id: newItemRef.key, ...newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear un nuevo elemento' });
  }
});

// Read (GET)
app.get('/api/items', async (req, res) => {
  try {
    const snapshot = await firebase.database().ref('/items').once('value');
    const items = [];
    snapshot.forEach((childSnapshot) => {
      items.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener elementos' });
  }
});

// Update (PUT)
app.put('/api/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;
  try {
    await firebase.database().ref(`/items/${itemId}`).update(updatedItem);
    res.json({ id: itemId, ...updatedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el elemento' });
  }
});

// Delete (DELETE)
app.delete('/api/items/:id', async (req, res) => {
  const itemId = req.params.id;
  try {
    await firebase.database().ref(`/items/${itemId}`).remove();
    res.json({ message: 'Elemento eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el elemento' });
  }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
