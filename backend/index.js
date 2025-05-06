const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Firebase servis hesabı JSON dosyasını alıyoruz
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Şifre reset endpoint'i
app.post('/admin/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      // Password Update, wenn der Benutzer möglich ist.
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().updateUser(user.uid, { password: newPassword });
      console.log(`Passwort für Benutzer ${email} wurde aktualisiert.`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Kullanıcı yoksa oluştur
        await admin.auth().createUser({
          email,
          password: newPassword,
        });
        console.log(`Neuer Benutzer wurde erstellt: ${email}`);
      } else {
        // Unerwartener Fehler
        console.error('X Unerwarteter Fehler:', error.message);
        return res.status(500).send({ error: error.message });
      }
    }
  
    res.status(200).send({ message: '✅ Passwort erfolgreich gesetzt oder aktualisiert.' });
  });
  
// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});
