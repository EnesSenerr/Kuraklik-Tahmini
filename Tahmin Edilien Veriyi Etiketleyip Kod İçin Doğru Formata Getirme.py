import pandas as pd

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)

# Read the CSV file into a DataFrame
df_forecast = pd.read_csv('forecasted_weather_data.csv')

# Filter the data for the relevant metric
df_filtered_forecast = df_forecast[df_forecast['Metric'] == 'Aylık Toplam Yağış Miktarı Ortalaması (mm)'].copy()

if not df_filtered_forecast.empty:
    # Display the first 5 rows
    print(df_filtered_forecast.head().to_markdown(index=False, numalign="left", stralign="left"))
else:
    print("No data found for the specified metric.")
    
    # Print the unique values of the `Metric` column
print(df_forecast['Metric'].unique())

# Filter the data for the relevant metric
df_filtered_forecast = df_forecast[df_forecast['Metric'] == 'Aylık Toplam Yağış Miktarı Ortalaması\r\n                  (mm)'].copy()

# Extract the month and year from the Month column
df_filtered_forecast['Ay'] = pd.to_datetime(df_filtered_forecast['Month']).dt.strftime('%B') # Ayı İngilizce olarak alıyoruz
df_filtered_forecast['Yıl'] = pd.to_datetime(df_filtered_forecast['Month']).dt.year

# Drop unnecessary columns
df_filtered_forecast.drop(['Metric', 'Month'], axis=1, inplace=True)

# Rename the 'Forecasted Value' column to 'Yağış Miktarı'
df_filtered_forecast = df_filtered_forecast.rename(columns={'Forecasted Value': 'Yağış Miktarı'})

# Group by 'Ay' and calculate the median 'Yağış Miktarı' for each month
ortanca_degerler = df_filtered_forecast.groupby('Ay')['Yağış Miktarı'].median().reset_index()
ortanca_degerler = ortanca_degerler.set_index('Ay').to_dict()['Yağış Miktarı']

# Sınıflandırma fonksiyonu (aynı fonksiyon)
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
df_filtered_forecast['Kuraklık Durumu'] = df_filtered_forecast.apply(lambda row: kuraklik_siniflandir(row['Yağış Miktarı'], row['Ay']), axis=1)

# Pivot tablo oluşturma (City, Yıl multi-index ve Ay columns)
kuraklik_pivot_forecast = df_filtered_forecast.pivot(index=['City', 'Yıl'], columns='Ay', values='Kuraklık Durumu')

# Dosyaya kaydetme
kuraklik_pivot_forecast.to_csv('kuraklik_tahmini_forecast.csv')

# Sonucu yazdırma
print(kuraklik_pivot_forecast.to_markdown(index=True, numalign="left", stralign="left"))

# Create a dictionary to store the results
kuraklik_sozluk_forecast = {}

# Iterate through the rows of the DataFrame
for index, row in kuraklik_pivot_forecast.reset_index().iterrows():
    city = row['City']
    yil = row['Yıl']
    kuraklik_durumlari = row.drop(['City', 'Yıl']).tolist()  # Extract the drought conditions as a list
    kuraklik_sozluk_forecast[(city, yil)] = kuraklik_durumlari

# Print the dictionary in the requested format
for (city, yil), durumlar in kuraklik_sozluk_forecast.items():
    print(f'"{city}": {durumlar},')