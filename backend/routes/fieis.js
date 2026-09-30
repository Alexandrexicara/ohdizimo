const e=require('express');const r=e.Router();const {cadastrar,listarPorIgreja}=require('../controllers/fielController');
r.post('/cadastro',async (req,res)=>{try{const f=await cadastrar(req.body);res.json({sucesso:true,dados:f})}catch(e){res.status(400).json({sucesso:false,erro:e.message})}});
r.get('/lista/:igreja_id',async (req,res)=>res.json(await listarPorIgreja(req.params.igreja_id)));
module.exports=r;
