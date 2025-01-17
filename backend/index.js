const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3001;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para registrar mensajes
app.use(morgan('tiny'));

// Datos de la agenda telefónica
let persons = [
    { "id": 1, "name": "Arto Hellas", "number": "040-123456" },
    { "id": 2, "name": "Ada Lovelace", "number": "39-44-5323523" },
    { "id": 3, "name": "Dan Abramov", "number": "12-43-234345" },
    { "id": 4, "name": "Mary Poppendieck", "number": "39-23-6423122" }
];

// Función para generar un nuevo ID único
function generateUniqueId() {
    return Math.floor(Math.random() * 1000000); // Genera un ID entre 0 y 999999
}

// Endpoint para devolver la lista de personas
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

// Endpoint para mostrar información de una persona específica
app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(p => p.id === parseInt(req.params.id));
    if (person) {
        res.send(`ID: ${person.id}<br/> Nombre: ${person.name}<br/> Número: ${person.number}`);
    } else {
        res.status(404).send('Persona no encontrada');
    }
});

// Endpoint para eliminar una persona específica
app.delete('/api/persons/:id', (req, res) => {
    const personIndex = persons.findIndex(p => p.id === parseInt(req.params.id));
    if (personIndex !== -1) {
        persons.splice(personIndex, 1);
        res.send('Persona eliminada');
    } else {
        res.status(404).send('Persona no encontrada');
    }
});

// Endpoint para agregar una nueva persona
app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;
    if (!name || !number) {
        return res.status(400).send({ error: 'Nombre y número son obligatorios' });
    }
    if (persons.find(p => p.name === name)) {
        return res.status(400).send({ error: 'El nombre debe ser único' });
    }
    const newPerson = {
        id: generateUniqueId(),
        name: name,
        number: number
    };
    persons.push(newPerson);
    res.send(`Persona agregada con ID: ${newPerson.id}`);
});

// Endpoint para mostrar información general
app.get('/info', (req, res) => {
    const currentTime = new Date().toLocaleString();
    const numberOfEntries = persons.length;
    res.send(`Hora de la solicitud: ${currentTime}<br/> Número de entradas en la agenda: ${numberOfEntries}`);
});

app.listen(port, () => {
    console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
