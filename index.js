const express=require('express');
const cors=require('cors');
const axios=require('axios');
const app=express();
app.use(cors());
app.use(express.json());

let utilisateurs=[];

app.get('/',(req,res)=>{
  res.send('Serveur OK - Mon Argent Etudiant marche ! Inscrits: '+utilisateurs.length);
});

app.post('/register',(req,res)=>{
  const u={
    id:Date.now(),
    nom:req.body.nom,
    whatsapp:req.body.whatsapp,
    ecole:req.body.ecole,
    date:new Date().toLocaleString('fr-FR')
  };
  utilisateurs.push(u);
  console.log('Nouvel inscrit:',u);
  res.json({success:true});
});

app.get('/users',(req,res)=>{
  res.json(utilisateurs);
});

app.get('/admin',(req,res)=>{
  let h=`<h1>${utilisateurs.length} inscrits</h1><table border=1 cellpadding=10><tr><th>Date</th><th>Nom</th><th>WhatsApp</th><th>Ecole</th></tr>`;
  utilisateurs.forEach(u=>{
    h+=`<tr><td>${u.date}</td><td>${u.nom}</td><td>${u.whatsapp}</td><td>${u.ecole}</td></tr>`;
  });
  h+=`</table><p>Actualise pour voir les nouveaux</p>`;
  res.send(h);
});

app.post('/payer',async(req,res)=>{
  try{
    const r=await axios.post('https://api.notchpay.co/payment',{amount:1000,currency:'XAF',description:'Premium'},{headers:{Authorization:process.env.NOTCHPAY_SECRET}});
    res.json(r.data);
  }catch(e){
    res.status(500).json({erreur:e.message});
  }
});

const PORT=process.env.PORT||10000;
app.listen(PORT,()=>console.log('Serveur sur port '+PORT));
