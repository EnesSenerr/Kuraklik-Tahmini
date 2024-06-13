document.addEventListener("DOMContentLoaded", function () {
    const sehirler = document.querySelectorAll('.city');

    // Kuraklık durumlarına karşılık gelen renkler
    const renkler = {
        "Kurak": "#FF5733",
        "Kurak ": "#FF5733",
        "Yarı Kurak": "#FFC300",
        "Yarı Nemli": "#4CAF50",
        "Yar� Nemli": "#4CAF50",
        "Nemli": "#3498DB",
        "Çok Nemli": "#9B59B6",
        "Çok Kurak": "#E74C3C"
    };

    // Neo4j bağlantı bilgileri
    const uri = 'bolt://localhost:7687';
    const user = 'neo4j';
    const password = '12345678';
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    async function fetchKuraklikVerileri(ay) {
        const session = driver.session();
        try {
            const result = await session.run(
                `MATCH (ay:Ay {name: $ay})-[:ICERIR]->(sehir:Sehir) 
                 RETURN sehir.name AS Il, sehir.kuraklik_durumu AS KuraklikDurumu`,
                { ay: ay }
            );

            const kuraklikVerileri = {};
            result.records.forEach(record => {
                const il = record.get('Il').toUpperCase();
                const kuraklikDurumu = record.get('KuraklikDurumu');
                kuraklikVerileri[il] = [kuraklikDurumu];
            });

            return kuraklikVerileri;
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            await session.close();
        }
    }

    const monthButtons = document.querySelectorAll(".monthButton");

    monthButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const ay = this.getAttribute('data-month');
            const kuraklikVerileri = await fetchKuraklikVerileri(ay);

            sehirler.forEach(sehir => {
                const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase();
                const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][0] : null;
                const renk = renkler[kuraklik] || "#FFFFFF";

                if (kuraklik) {
                    sehir.querySelector('path').style.fill = renk;
                }
            });
        });
    });
});