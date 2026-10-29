const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Cahier pour noter tous les inscrits
let utilisateurs = [];

app.get('/', (req, res) => {
  res.send('Serveur OK - Mon Argent Etudiant marche ! Nombre inscrits: ' + utilisateurs.length);
});

// Quand quelqu'un s'inscrit sur ton site
app.post('/register', (req, res) => {
  const user = {
    id: Date.now(),
    nom: req.body.nom,
    whatsapp: req.body.whatsapp,
    ecole: req.body.ecole,
    date: new Date().toLocaleString('fr-FR')
  };
  utilisateurs.push(user);
  console.log('Nouvel inscrit:', user);
  res.json({ success: true, user });
});

// Voir la liste de tous les inscrits (pour toi)
app.get('/users', (req, res) => {
  res.json(utilisateurs);
});

// Belle page ADMIN pour toi
app.get('/admin', (req, res) => {
  let html = `<h1>Liste des inscrits - ${utilisateurs.length} clients</h1><table border=1 cellpadding=10><tr><th>Date</th><th>Nom</th><th>WhatsApp</th><th>Ecole</th></tr>`;
  utilisateurs.forEach(u => {
    html += `<tr><td>${u.date}</td><td>${u.nom}</td><td>${u.whatsapp}</td><td>${u.ecole}</td></tr>`;
  });
  html += `</table><p>Actualise la page pour voir les nouveaux.</p>`;
  res.send(html);
});

// Paiement Premium
app.post('/payer', async (req, res) => {
  try {
    const r = await axios.post('https://api.notchpay.co/payment', {
      amount: 1000, currency: 'XAF', description: 'Abonnement Premium'
    }, { headers: { Authorization: process.env.NOTCHPAY_SECRET } });
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ erreur: e.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Serveur lance sur port ' + PORT));
