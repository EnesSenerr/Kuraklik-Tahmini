# Türkiye'de Kuraklık Tahmini ve İnteraktif Görselleştirme

Bu proje, Türkiye'nin farklı illerindeki kuraklık riskini tahmin etmek ve bu bilgiyi etkileşimli bir harita üzerinde görselleştirmek için yapay zeka ve grafik veritabanı teknolojilerini kullanır.

---

## Proje Görselleri

# ![image](https://github.com/EnesSenerr/Kuraklik-Tahmini/assets/95829898/367421b5-4b00-42fc-8e25-670662811d57)
# ![image](https://github.com/EnesSenerr/Kuraklik-Tahmini/assets/95829898/a30353cb-ecf4-48f1-8508-fe914bf7f01c)
# ![image](https://github.com/EnesSenerr/Kuraklik-Tahmini/assets/95829898/4abac830-bbae-4475-a74d-25a900a4e70c)

---

## Proje Özeti

Türkiye'nin geleceği için hayati bir konu olan kuraklıkla mücadelede, bilimsel verilerin gücünü kullanarak daha bilinçli ve sürdürülebilir bir gelecek inşa ediyoruz.  

- **Geçmiş yıllara ait aylık yağış miktarı verileri** kullanılarak SARIMA modeli ile geleceğe yönelik tahminler yapılmıştır.  
- Tahmin sonuçları, **Neo4j grafik veritabanında** iller, aylar ve kuraklık durumları arasındaki ilişkilerle birlikte saklanmıştır.  
- Kullanıcıların detaylı hava durumu ve kuraklık bilgilerine erişebileceği **etkileşimli bir harita arayüzü** geliştirilmiştir.
- Şehirlerin gün doğumu ve batımını bir ilerleme çubuğu şeklinde görselleştirebiliyoruz.

---

## Projenin Amacı

- Türkiye'deki kuraklık riskini önceden tahmin ederek tarım, su kaynakları yönetimi gibi alanlarda karar vericilere bilgi sağlamak.  
- Kuraklık bilgilerini **anlaşılır ve erişilebilir** hale getirmek.  
- Yapay zeka ve grafik veritabanı teknolojileriyle **kuraklık tahminlerinin doğruluğunu artırmak.**

---

## Kullanılan Teknolojiler

- **Python:** Veri analizi, modelleme ve Neo4j ile etkileşim.  
- **Pandas:** Veri işleme ve analiz.  
- **NumPy:** Sayısal işlemler.  
- **Statsmodels:** SARIMA modelinin oluşturulması ve eğitimi.  
- **Neo4j:** Grafik veritabanı.  
- **JavaScript:** İnteraktif harita ve veri görselleştirme.  
- **HTML/CSS:** Web arayüzü tasarımı.

---

## Veri Seti

- **Kaynak:** Meteoroloji Genel Müdürlüğü (MGM).  
- **İçerik:** Türkiye'nin 81 iline ait aylar boyunca kaydedilmiş aylık yağış miktarı verileri.  

---

## Model ve Yöntem

### SARIMA (Seasonal Autoregressive Integrated Moving Average)
- **Amaç:** Geçmiş yağış verilerini analiz ederek gelecekteki yağış miktarlarını tahmin etmek.  

### Model Eğitimi
- Geçmiş veriler kullanılarak SARIMA modeli eğitilmiştir.  
- Performans değerlendirmesi için **Ortalama Mutlak Hata (MAE)** kullanılmıştır.  

### Kuraklık Sınıflandırması
- Tahmin edilen yağış miktarları, **aylık ortalama yağış miktarlarına göre** şu sınıflara ayrılmıştır:  
  - Çok Kurak  
  - Kurak  
  - Yarı Kurak  
  - Yarı Nemli  
  - Nemli  
  - Çok Nemli  

---

## İnteraktif Harita

- **Türkiye Haritası:** İllerin kuraklık durumlarına göre renklendirilmiştir.  
- **Etkileşim:** Kullanıcılar, illere tıklayarak detaylı hava durumu ve kuraklık bilgilerini görebilir.  
- **Görselleştirme:** Grafikler ve tablolar aracılığıyla kuraklık tahminleri sunulmaktadır.  

---

1. Bu repoyu klonlayın:  
   ```bash
   git clone https://github.com/EnesSenerr/Kuraklik-Tahmini.git
   cd Kuraklik-Tahmini

2. Gerekli kütüphaneleri yükleyin:
   ```bash
   pip install pandas numpy statsmodels py2neo   

3. Neo4j veritabanınızı başlatın.

4. weather_data.csv dosyasını proje dizinine yerleştirin.

5. Python betiğini çalıştırın:
   ```bash
   python your_script_name.py

6. Oluşturulan index.html dosyasını tarayıcınızda açarak etkileşimli haritayı görüntüleyin.
    
