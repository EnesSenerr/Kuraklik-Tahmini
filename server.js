const neo4j = require('neo4j-driver');
const express = require('express');
const app = express();

// Neo4j bağlantı bilgileri (şifrenizi değiştirin)
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '12345678'));

app.get('/api/kuraklik/:ay', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (ay:Ay {name: $ay})-[:ICERIR]->(sehir:Sehir) RETURN sehir.name AS sehirAdi, sehir.kuraklik_durumu AS kuraklik',
      { ay: req.params.ay }
    );
    const kuraklikVerileri = result.records.map(record => ({
      sehirAdi: record.get('sehirAdi'),
      kuraklik: record.get('kuraklik')
    }));
    res.json(kuraklikVerileri);
  } finally {
    await session.close();
  }
});

// Sunucuyu başlat
app.listen(3000, () => console.log('Sunucu 3000 portunda çalışıyor'));
