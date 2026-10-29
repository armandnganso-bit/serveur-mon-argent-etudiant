const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(cors());
app.use(express.json());
app.post('/payer', async (req, res) => {
  try {
    const r = await axios.post('https://api.notchpay.co/payments/initialize', {
      amount: 1000, currency: 'XAF', description: 'Abonnement', customer: { email: req.body.email || 'etudiant@test.cm', name: 'Etudiant' }
    }, { headers: { 'Authorization': process.env.NOTCHPAY_SK_TEST, 'Content-Type': 'application/json' } });
    res.json(r.data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/', (req, res) => res.send('Serveur OK'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(PORT));