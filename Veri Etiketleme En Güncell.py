import pandas as pd

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)

# Read the CSV file into a DataFrame
df = pd.read_csv('weather_data.csv')

#Correcting the typo in Metric column
df['Metric'] = df['Metric'].astype(str).str.replace(' ', '', regex=False)

# Sadece gerekli sütunları seçme ve filtreleme (typo corrected)
df_filtered = df.loc[df['Metric'] == 'AylıkToplamYağışMiktarıOrtalaması\r\n(mm)', ['City'] + list(df.columns[2:])].copy()

# Uzun formata dönüştürme
df_long = df_filtered.melt(id_vars=['City'], var_name='Ay', value_name='Yağış Miktarı')

# Değerleri sayısal hale getirme
df_long['Yağış Miktarı'] = df_long['Yağış Miktarı'].astype(str).str.replace(',', '.', regex=False)
df_long['Yağış Miktarı'] = pd.to_numeric(df_long['Yağış Miktarı'], errors='coerce')

# 0'dan küçük değerleri 0'a eşitleme
df_long['Yağış Miktarı'] = df_long['Yağış Miktarı'].apply(lambda x: max(0, x))

# Kuraklık sınıflandırması için ortanca değerleri hesaplama
aylar = df_long['Ay'].unique()
ortanca_degerler = df_long.groupby('Ay')['Yağış Miktarı'].median().reset_index()
ortanca_degerler = ortanca_degerler.set_index('Ay').to_dict()['Yağış Miktarı']

# Sınıflandırma fonksiyonu
def kuraklik_siniflandir(yagis, ay):
    ortanca = ortanca_degerler[ay]
    if yagis == 0:
        return "Çok Kurak"
    elif 0 < yagis <= 0.5 * ortanca:
        return "Kurak"
    elif 0.5 * ortanca < yagis <= 0.8 * ortanca:
        return "Yarı Kurak"
    elif 0.8 * ortanca < yagis <= 1.2 * ortanca:
        return "Yarı Nemli"
    elif 1.2 * ortanca < yagis <= 2 * ortanca:
        return "Nemli"
    else:
        return "Çok Nemli"

# Sınıflandırma uygulama
df_long['Kuraklık Durumu'] = df_long.apply(lambda row: kuraklik_siniflandir(row['Yağış Miktarı'], row['Ay']), axis=1)

# Pivot tablo oluşturma
kuraklik_pivot = df_long.pivot(index='City', columns='Ay', values='Kuraklık Durumu')

# Doğru ay sırasını belirleyin
dogru_ay_sirasi = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

# Sütunları doğru ay sırasına göre yeniden düzenleyin
kuraklik_pivot = kuraklik_pivot.reindex(columns=dogru_ay_sirasi)

# Dosyaya kaydetme
kuraklik_pivot.to_csv('kuraklik_tahmini_duzeltilmis.csv')

# Sonucu yazdırma
print(kuraklik_pivot.to_markdown(index=True, numalign="left", stralign="left"))