import requests
from bs4 import BeautifulSoup
import csv

base_url = "https://www.mgm.gov.tr/veridegerlendirme/il-ve-ilceler-istatistik.aspx?k=A&m={}"

cities = [
    "ADANA", "ADIYAMAN", "AFYONKARAHISAR", "AGRI", "AKSARAY", "AMASYA", "ANKARA", "ANTALYA",
    "ARDAHAN", "ARTVIN", "AYDIN", "BALIKESIR", "BARTIN", "BATMAN", "BAYBURT", "BILECIK",
    "BINGOL", "BITLIS", "BOLU", "BURDUR", "BURSA", "CANAKKALE", "CANKIRI", "CORUM",
    "DENIZLI", "DIYARBAKIR", "DUZCE", "EDIRNE", "ELAZIG", "ERZINCAN", "ERZURUM", "ESKISEHIR",
    "GAZIANTEP", "GIRESUN", "GUMUSHANE", "HAKKARI", "HATAY", "IGDIR", "ISPARTA", "ISTANBUL",
    "IZMIR", "KAHRAMANMARAS", "KARABUK", "KARAMAN", "KARS", "KASTAMONU", "KAYSERI", "KIRIKKALE",
    "KIRKLARELI", "KIRSEHIR", "KILIS", "KOCAELI", "KONYA", "KUTAHYA", "MALATYA", "MANISA",
    "MARDIN", "ICEL", "MUGLA", "MUS", "NEVSEHIR", "NIGDE", "ORDU", "OSMANIYE", "RIZE",
    "SAKARYA", "SAMSUN", "SIIRT", "SINOP", "SIVAS", "SANLIURFA", "SIRNAK", "TEKIRDAG",
    "TOKAT", "TRABZON", "TUNCELI", "USAK", "VAN", "YALOVA", "YOZGAT", "ZONGULDAK"
]

data = []

# Define the headers
headers = ["City", "Metric", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

for city in cities:
    url = base_url.format(city)
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    
    # Find the table in the page
    table = soup.find("table")
    
    # Extract data
    if table:
        rows = table.find_all("tr")
        for row in rows[2:]:  # Skip the first two header rows
            cols = row.find_all(["td", "th"])
            metric = cols[0].text.strip()
            values = [col.text.strip() for col in cols[1:13]]  # Only get the first 12 columns (months)
            data.append([city, metric] + values)

# Write to CSV
with open("weather_data.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(headers)
    writer.writerows(data)

print("Data has been written to weather_data.csv")
