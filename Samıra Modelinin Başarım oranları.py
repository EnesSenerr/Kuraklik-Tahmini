import pandas as pd
import numpy as np
from statsmodels.tsa.statespace.sarimax import SARIMAX
import warnings
warnings.filterwarnings("ignore")

# Veriyi yükle
data = pd.read_csv("weather_data.csv")

# Aylar
months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

# Şehir ve metrik bilgilerini al
cities = data["City"].unique()
metrics = data["Metric"].unique()

# Aylık toplam yağış miktarı ortalaması verilerini filtrele (Düzeltilmiş)
df_filtered = data[data['Metric'] == 'AylıkToplamYağışMiktarıOrtalaması\r\n(mm)'].copy()

# Tahmin sonuçlarını saklamak için boş bir liste oluştur
forecast_data = []

 #Her şehir ve metrik için tahmin yap
mae_values = {}
for city in cities:
    for metric in metrics:
        df = data[(data["City"] == city) & (data["Metric"] == metric)]
        
        if df.empty:
            continue

        # Ayları temsil eden sütunları al ve veri formatını düzelt
        df_monthly = df[months].T
        df_monthly.columns = ["Value"]
        df_monthly.index = pd.date_range(start='1/1/2023', periods=12, freq='M')
        df_monthly["Value"] = df_monthly["Value"].str.replace(',', '.', regex=False).astype(float)

        # Train ve test verilerini ayır
        train = df_monthly.loc[:'2023-09']
        test = df_monthly.loc['2023-10':]

        # SARIMA modelini oluştur ve eğit
        model = SARIMAX(train, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
        model_fit = model.fit(disp=False)

        # Tahmin yap
        forecast = model_fit.get_forecast(steps=len(test))
        y_pred = forecast.predicted_mean

        # Gerçek değerler ve tahminleri birleştir
        results = pd.DataFrame({'Gerçek': test["Value"], 'Tahmin': y_pred})

        # Hata metriklerini hesapla
        mae = np.mean(np.abs(results['Gerçek'] - results['Tahmin']))
        mse = np.mean((results['Gerçek'] - results['Tahmin'])**2)
        mape = np.mean(np.abs((results['Gerçek'] - results['Tahmin']) / results['Gerçek'])) * 100

        # Sonuçları yazdır
        print(f"\n{city} - {metric} için Hata Metrikleri:")
        print(f"  MAE: {mae:.2f}")
        print(f"  MSE: {mse:.2f}")
        print(f"  MAPE: {mape:.2f}%")

        mae_values[(city, metric)] = mae

# Tüm MAE değerlerinin ortalamasını hesapla (genel ortalama MAE)
ortalama_mae = np.mean(list(mae_values.values()))
print("\nOrtalama Mutlak Hata (MAE):", ortalama_mae)