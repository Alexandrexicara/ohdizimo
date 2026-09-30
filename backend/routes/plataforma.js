const e=require('express');const r=e.Router();const {getTaxa,setTaxa}=require('../utils/taxa');const db=require('../config/db');
r.get('/taxa',async (req,res)=>res.json({taxa_atual:await getTaxa()}));
r.put('/taxa',async (req,res)=>{const t=Number(req.body.nova_taxa);if(![3,5,10].includes(t))return res.status(400).json({erro:'Apenas 3,5,10'});res.json({sucesso:true,taxa:await setTaxa(t)})});
r.get('/resumo',async (req,res)=>{
  const ig=await db.query('SELECT COUNT(*) as total FROM igrejas WHERE ativo=true');
  const pg=await db.query('SELECT COUNT(*) as qtd,COALESCE(SUM(valor_pago),0) as total,COALESCE(SUM(taxa_plataforma),0) as lucro FROM pagamentos WHERE status=$1',['pago']);
  res.json({igrejas:ig.rows[0].total,pagamentos:pg.rows[0].qtd,arrecadado:pg.rows[0].total,ganho_plataforma:pg.rows[0].lucro});
});
module.exports=r;
