const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const serviceAccount = require('./proiect-pulse-sensor-firebase-adminsdk-oq0mu-726ccbe175.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://console.firebase.google.com/project/proiect-pulse-sensor/firestore/databases/-default-/data"
});

const db = admin.firestore();

const app = express();
app.use(bodyParser.json());

// POST endpoint at the root
app.post('/', async (req, res) => {
  try {
    const pulse = req.body;
    if (!pulse || Object.keys(pulse).length === 0) {
      return res.status(400).send({ message: "No data provided" });
    }

    const data = {
        Pulse: pulse['Pulse'],
        Time: new Date()
    };
    console.log(data);

    const docRef = await db.collection('Pulses').add(data);
    res.status(200).send({ message: 'Data stored successfully', id: docRef.id });
  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
