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

# Tahmin sonuçlarını saklamak için boş bir DataFrame oluştur
forecast_df = pd.DataFrame(columns=["City", "Metric", "Month", "Forecasted Value"])

# Her şehir ve metrik için tahmin yap
for city in cities:
    for metric in metrics:
        df = data[(data["City"] == city) & (data["Metric"] == metric)]
        
        if df.empty:
            continue

        # Ayları temsil eden sütunları al ve veri formatını düzelt
        df_monthly = df[months].T
        df_monthly.columns = ["Value"]
        df_monthly.index = pd.date_range(start='1/1/2023', periods=12, freq='M')
        df_monthly["Value"] = df_monthly["Value"].str.replace(',', '.').astype(float)

        # SARIMA modelini oluştur ve eğit
        model = SARIMAX(df_monthly, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
        sarima_fit = model.fit(disp=False)

        # Tahmin yap
        forecast = sarima_fit.get_forecast(steps=12)
        forecast_index = pd.date_range(start='1/1/2024', periods=12, freq='M')
        forecast_values = forecast.predicted_mean

        # Tahmin sonuçlarını DataFrame'e ekle
        for i, value in enumerate(forecast_values):
            forecast_df = forecast_df.append({
                "City": city,
                "Metric": metric,
                "Month": forecast_index[i].strftime("%Y-%m"),
                "Forecasted Value": value
            }, ignore_index=True)

# Tahmin sonuçlarını CSV dosyasına kaydet
forecast_df.to_csv("forecasted_weather_data.csv", index=False)

print("Tahmin sonuçları forecasted_weather_data.csv dosyasına kaydedildi.")
