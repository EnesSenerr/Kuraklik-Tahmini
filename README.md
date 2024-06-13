Türkiye'de Kuraklık Tahmini ve İnteraktif Görselleştirme
Bu proje, Türkiye'nin farklı illerindeki kuraklık riskini tahmin etmek ve bu bilgiyi etkileşimli bir harita üzerinde görselleştirmek için yapay zeka ve grafik veritabanı teknolojilerini kullanır.

Proje Özeti
Türkiye'nin geleceği için hayati bir konu olan kuraklıkla mücadelede, bilimsel verilerin gücünü kullanarak daha bilinçli ve sürdürülebilir bir gelecek inşa ediyoruz. Bu projede, geçmiş yıllara ait aylık yağış miktarı verileri kullanılarak SARIMA modeli ile gelecek aylara ait yağış tahminleri yapılmış ve bu tahminler iller, aylar ve kuraklık durumu arasındaki ilişkileri modelleyen Neo4j grafik veritabanında saklanmıştır. Son olarak, kullanıcıların şehirleri seçerek detaylı hava durumu ve kuraklık bilgilerine erişebileceği etkileşimli bir harita arayüzü geliştirilmiştir.

Projenin Amacı
Türkiye'deki kuraklık riskini önceden tahmin ederek, tarım, su kaynakları yönetimi ve diğer ilgili alanlarda karar vericilere ve topluma bilgi sağlamak.
Kuraklık bilgilerini anlaşılır ve erişilebilir hale getirmek.
Yapay zeka ve grafik veritabanı teknolojileriyle kuraklık tahminlerinin doğruluğunu ve güvenilirliğini artırmak.
Kullanılan Teknolojiler
Python: Veri analizi, modelleme ve Neo4j ile etkileşim için.
Pandas: Veri işleme ve analiz.
NumPy: Sayısal işlemler.
Statsmodels: SARIMA modelinin oluşturulması ve eğitimi.
Neo4j: Grafik veritabanı.
JavaScript: İnteraktif harita oluşturma ve veri görselleştirme.
HTML/CSS: Web arayüzü tasarımı.
Veri Seti
Projede, Türkiye'nin 81 ilinin uzun yıllar boyunca kaydedilmiş aylık yağış miktarı verileri kullanılmıştır. Bu veriler, Meteoroloji Genel Müdürlüğü'nün (MGM) resmi web sitesinden elde edilmiştir.

Model ve Yöntem
SARIMA (Seasonal Autoregressive Integrated Moving Average): Zaman serisi analizi için kullanılan bir modeldir. Geçmiş yağış verilerini analiz ederek gelecekteki yağış miktarını tahmin eder.
Model Eğitimi: SARIMA modeli, geçmiş yağış verileri kullanılarak eğitilmiştir. Modelin performansı, ortalama mutlak hata (MAE) gibi metriklerle değerlendirilmiştir.
Kuraklık Sınıflandırması: Tahmin edilen yağış miktarları, aylık ortalama yağış miktarlarına göre kuraklık sınıflarına ayrılmıştır (Çok Kurak, Kurak, Yarı Kurak, Yarı Nemli, Nemli, Çok Nemli).

İnteraktif Harita

Türkiye Haritası: Türkiye haritası, illerin kuraklık durumuna göre renklendirilerek görselleştirilmiştir.
Etkileşim: Kullanıcılar, harita üzerindeki illere tıklayarak o ilin detaylı hava durumu ve kuraklık bilgilerini görebilirler.
Görselleştirme: Grafikler ve tablolar kullanılarak kuraklık tahminleri ve diğer ilgili bilgiler sunulmaktadır.

Kurulum ve Çalıştırma
Bu repoyu klonlayın.
Gerekli kütüphaneleri yükleyin (pip install pandas numpy statsmodels py2neo).
Neo4j veritabanınızı başlatın.
"weather_data.csv" dosyasını proje dizinine yerleştirin.
Python betiğini çalıştırın (python your_script_name.py).
Oluşturulan "index.html" dosyasını web tarayıcınızda açın.
