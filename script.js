document.addEventListener("DOMContentLoaded", function() {
    var apiKey = 'f5234702acd972a58d15a1beb78395c1';
    var paths = document.querySelectorAll(".mapdiv .city");
    var scaleFactor = 1.5; // Büyüme faktörü

    // Şehir isimlerini düzeltmek için bir dönüşüm haritası
    const cityCorrectionMap = {
        "AFYONKARAH�SAR": "AFYONKARAHISAR",
        "Icel":"MERSIN"
        // Buraya başka düzeltmeler de ekleyebilirsiniz
    };

    function correctCityName(cityName) {
        return cityCorrectionMap[cityName] || cityName;
    }

    paths.forEach(function(city) {
        var cityName = city.getAttribute("data-cityname");
        var correctedCityName = correctCityName(cityName); // Şehir adını düzelt
        var path = city.querySelector("path");

        city.addEventListener("click", function() {
            fetchWeatherData(correctedCityName);
            document.querySelectorAll('.city').forEach(function(c) {
                c.classList.remove('selected');
                c.querySelector("path").style.transform = "scale(1)";
            });
            this.classList.add('selected');

            // Seçilen şehri büyüt
            var rect = path.getBoundingClientRect();
            var currentWidth = rect.width;
            var currentHeight = rect.height;

            var newWidth = currentWidth * scaleFactor;
            var newHeight = currentHeight * scaleFactor;

            path.style.width = newWidth + "px";
            path.style.height = newHeight + "px";
            path.style.transition = "width 0.7s ease, height 0.7s ease";
            path.style.zIndex = 100;
        });
    });

    function fetchWeatherData(cityName) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                var cityId = data.id;
                fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&lang=tr&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(data => {
                        updateWeatherInfo(cityName, data);
                    })
                    .catch(error => console.error('Error fetching weather data:', error));
            })
            .catch(error => console.error('Error fetching city ID:', error));
    }

    function updateWeatherInfo(cityName, data) {
        document.getElementById('cityName').textContent = `${cityName} Hava Durumu`;
        document.getElementById('temperature').textContent = data.main.temp + " °C";
        document.getElementById('weather').textContent = data.weather[0].description;
        document.getElementById('humidity').textContent = data.main.humidity + " %";

        var sunrise = new Date(data.sys.sunrise * 1000);
        var sunset = new Date(data.sys.sunset * 1000);
        var now = new Date();

        var sunriseElement = document.getElementById('sunrise');
        var sunsetElement = document.getElementById('sunset');

        sunriseElement.textContent = "Gün Doğumu: " + sunrise.toLocaleTimeString();
        sunsetElement.textContent = "Gün Batımı: " + sunset.toLocaleTimeString();

        sunriseElement.classList.add('visible');
        sunsetElement.classList.add('visible');

        updateLoadingBar(sunrise, sunset, now);
    }

    function updateLoadingBar(sunrise, sunset, now) {
        var totalTime = sunset - sunrise;
        var currentTime = now - sunrise;
        var progress = (currentTime / totalTime) * 100;
        var loadingBar = document.getElementById('loading-bar');

        var maxWidth = '100%';

        if (progress > parseFloat(maxWidth)) {
            progress = parseFloat(maxWidth); // Genişliği maksimum değere sınırla
        }
        loadingBar.style.width = progress + '%';
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const ocakButon = document.getElementById("ocakButon");
    const sehirler = document.querySelectorAll('.city');

    // Tüm şehirlerin kuraklık durumlarını içeren dizi
    const kuraklikVerileri = {
        "ADANA": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "AFYONKARAH�SAR":["Kurak","Kurak","Yarı Kurak", "Yarı Kurak",  "Yarı Nemli","Yarı Nemli","Yarı Kurak","Kurak","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli"],
        "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "AGRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "AMASYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANTALYA": ['Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "ARDAHAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "ARTVIN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "AYDIN": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "BALIKESIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "BARTIN": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BATMAN": ['Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
        "BAYBURT": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "BILECIK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BINGOL": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Nemli'],
        "BITLIS": ['Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BOLU": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "BURSA": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANAKKALE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak'],
        "CORUM": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "DENIZLI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "DIYARBAKIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "DUZCE": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "EDIRNE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "ELAZIG": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
        "ERZINCAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ERZURUM": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ESKISEHIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "GAZIANTEP": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "GIRESUN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
        "GUMUSHANE": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "HAKKARI": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "HATAY": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
        "ICEL": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "IGDIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli'],
        "ISTANBUL": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KARABUK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KARS": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "KASTAMONU": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "KAYSERI": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
        "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRIKKALE": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KIRKLARELI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KOCAELI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "KONYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KUTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "MALATYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "MARDIN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli'],
        "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "MUS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "NIGDE": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ORDU": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "OSMANIYE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
        "SAKARYA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "SAMSUN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SANLIURFA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
        "SIIRT": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SINOP": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SIRNAK": ['Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SIVAS": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "TRABZON": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli'],
        "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "VAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "YALOVA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "ZONGULDAK": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
    };

    

    const renkler = {
        "Kurak": "#FF5733",
        "Yarı Kurak": "#FFC300",
        "Yarı Nemli": "#4CAF50",
        "Nemli": "#3498DB",
        "Çok Nemli": "#9B59B6",
        "Çok Kurak": "#E74C3C"
    };

    ocakButon.addEventListener("click", function () {
        sehirler.forEach(sehir => {
            const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
            const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][0] : null; // Ocak ayı verisini al
            const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

            if (kuraklik) {
                sehir.querySelector('path').style.fill = renk;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const subat = document.getElementById("subat");
    const sehirler = document.querySelectorAll('.city');

    // Tüm şehirlerin kuraklık durumlarını içeren dizi
    const kuraklikVerileri = {
        "ADANA": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "AFYONKARAH�SAR":["Kurak","Kurak","Yarı Kurak", "Yarı Kurak",  "Yarı Nemli","Yarı Nemli","Yarı Kurak","Kurak","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli"],
        "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "AGRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "AMASYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANTALYA": ['Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "ARDAHAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "ARTVIN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "AYDIN": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "BALIKESIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "BARTIN": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BATMAN": ['Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
        "BAYBURT": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "BILECIK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BINGOL": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Nemli'],
        "BITLIS": ['Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BOLU": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "BURSA": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANAKKALE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak'],
        "CORUM": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "DENIZLI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "DIYARBAKIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "DUZCE": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "EDIRNE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "ELAZIG": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
        "ERZINCAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ERZURUM": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ESKISEHIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "GAZIANTEP": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "GIRESUN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
        "GUMUSHANE": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "HAKKARI": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "HATAY": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
        "ICEL": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "IGDIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli'],
        "ISTANBUL": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KARABUK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KARS": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "KASTAMONU": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "KAYSERI": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
        "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRIKKALE": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KIRKLARELI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KOCAELI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "KONYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KUTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "MALATYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "MARDIN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli'],
        "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "MUS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "NIGDE": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ORDU": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "OSMANIYE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
        "SAKARYA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "SAMSUN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SANLIURFA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
        "SIIRT": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SINOP": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SIRNAK": ['Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SIVAS": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "TRABZON": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli'],
        "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "VAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "YALOVA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "ZONGULDAK": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
    };

    const renkler = {
        "Kurak": "#FF5733",
        "Yarı Kurak": "#FFC300",
        "Yarı Nemli": "#4CAF50",
        "Nemli": "#3498DB",
        "Çok Nemli": "#9B59B6",
        "Çok Kurak": "#E74C3C"
    };

    subat.addEventListener("click", function () {
        sehirler.forEach(sehir => {
            const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
            const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][1] : null; // Ocak ayı verisini al
            const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

            if (kuraklik) {
                sehir.querySelector('path').style.fill = renk;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const mart = document.getElementById("mart");
    const sehirler = document.querySelectorAll('.city');

    // Tüm şehirlerin kuraklık durumlarını içeren dizi
    const kuraklikVerileri = {
        "ADANA": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "AFYONKARAH�SAR":["Kurak","Kurak","Yarı Kurak", "Yarı Kurak",  "Yarı Nemli","Yarı Nemli","Yarı Kurak","Kurak","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli"],
        "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "AGRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "AMASYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANTALYA": ['Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "ARDAHAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "ARTVIN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "AYDIN": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "BALIKESIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "BARTIN": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BATMAN": ['Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
        "BAYBURT": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "BILECIK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BINGOL": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Nemli'],
        "BITLIS": ['Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BOLU": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "BURSA": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANAKKALE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak'],
        "CORUM": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "DENIZLI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "DIYARBAKIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "DUZCE": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "EDIRNE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "ELAZIG": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
        "ERZINCAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ERZURUM": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ESKISEHIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "GAZIANTEP": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "GIRESUN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
        "GUMUSHANE": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "HAKKARI": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "HATAY": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
        "ICEL": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "IGDIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli'],
        "ISTANBUL": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KARABUK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KARS": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "KASTAMONU": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "KAYSERI": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
        "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRIKKALE": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KIRKLARELI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KOCAELI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "KONYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KUTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "MALATYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "MARDIN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli'],
        "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "MUS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "NIGDE": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ORDU": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "OSMANIYE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
        "SAKARYA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "SAMSUN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SANLIURFA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
        "SIIRT": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SINOP": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SIRNAK": ['Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SIVAS": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "TRABZON": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli'],
        "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "VAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "YALOVA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "ZONGULDAK": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
    };

    const renkler = {
        "Kurak": "#FF5733",
        "Yarı Kurak": "#FFC300",
        "Yarı Nemli": "#4CAF50",
        "Nemli": "#3498DB",
        "Çok Nemli": "#9B59B6",
        "Çok Kurak": "#E74C3C"
    };

    mart.addEventListener("click", function () {
        sehirler.forEach(sehir => {
            const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
            const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][2] : null; // Ocak ayı verisini al
            const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

            if (kuraklik) {
                sehir.querySelector('path').style.fill = renk;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const nisan = document.getElementById("nisan");
    const sehirler = document.querySelectorAll('.city');

    // Tüm şehirlerin kuraklık durumlarını içeren dizi
    const kuraklikVerileri = {
        "ADANA": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "AFYONKARAH�SAR":["Kurak","Kurak","Yarı Kurak", "Yarı Kurak",  "Yarı Nemli","Yarı Nemli","Yarı Kurak","Kurak","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli"],
        "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "AGRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "AMASYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANTALYA": ['Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "ARDAHAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "ARTVIN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "AYDIN": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "BALIKESIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "BARTIN": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BATMAN": ['Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
        "BAYBURT": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "BILECIK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BINGOL": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Nemli'],
        "BITLIS": ['Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BOLU": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "BURSA": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANAKKALE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak'],
        "CORUM": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "DENIZLI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "DIYARBAKIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "DUZCE": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "EDIRNE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "ELAZIG": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
        "ERZINCAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ERZURUM": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ESKISEHIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "GAZIANTEP": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "GIRESUN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
        "GUMUSHANE": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "HAKKARI": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "HATAY": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
        "ICEL": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "IGDIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli'],
        "ISTANBUL": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KARABUK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KARS": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "KASTAMONU": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "KAYSERI": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
        "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRIKKALE": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KIRKLARELI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KOCAELI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "KONYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KUTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "MALATYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "MARDIN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli'],
        "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "MUS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "NIGDE": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ORDU": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "OSMANIYE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
        "SAKARYA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "SAMSUN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SANLIURFA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
        "SIIRT": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SINOP": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SIRNAK": ['Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SIVAS": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "TRABZON": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli'],
        "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "VAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "YALOVA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "ZONGULDAK": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
    };

    const renkler = {
        "Kurak": "#FF5733",
        "Yarı Kurak": "#FFC300",
        "Yarı Nemli": "#4CAF50",
        "Nemli": "#3498DB",
        "Çok Nemli": "#9B59B6",
        "Çok Kurak": "#E74C3C"
    };

    nisan.addEventListener("click", function () {
        sehirler.forEach(sehir => {
            const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
            const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][3] : null; // Ocak ayı verisini al
            const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

            if (kuraklik) {
                sehir.querySelector('path').style.fill = renk;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const mayis = document.getElementById("mayis");
    const sehirler = document.querySelectorAll('.city');

    // Tüm şehirlerin kuraklık durumlarını içeren dizi
    const kuraklikVerileri = {
        "ADANA": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "AFYONKARAH�SAR":["Kurak","Kurak","Yarı Kurak", "Yarı Kurak",  "Yarı Nemli","Yarı Nemli","Yarı Kurak","Kurak","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli"],
        "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "AGRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "AMASYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANTALYA": ['Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "ARDAHAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "ARTVIN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "AYDIN": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "BALIKESIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "BARTIN": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BATMAN": ['Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
        "BAYBURT": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "BILECIK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BINGOL": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Nemli'],
        "BITLIS": ['Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BOLU": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "BURSA": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANAKKALE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak'],
        "CORUM": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "DENIZLI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "DIYARBAKIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "DUZCE": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "EDIRNE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "ELAZIG": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
        "ERZINCAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ERZURUM": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ESKISEHIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "GAZIANTEP": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "GIRESUN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
        "GUMUSHANE": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "HAKKARI": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "HATAY": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
        "ICEL": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "IGDIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli'],
        "ISTANBUL": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KARABUK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KARS": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "KASTAMONU": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "KAYSERI": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
        "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRIKKALE": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KIRKLARELI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KOCAELI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "KONYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KUTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "MALATYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "MARDIN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli'],
        "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "MUS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "NIGDE": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ORDU": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "OSMANIYE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
        "SAKARYA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "SAMSUN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SANLIURFA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
        "SIIRT": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SINOP": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SIRNAK": ['Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SIVAS": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "TRABZON": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli'],
        "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "VAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "YALOVA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "ZONGULDAK": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
    };

    const renkler = {
        "Kurak": "#FF5733",
        "Yarı Kurak": "#FFC300",
        "Yarı Nemli": "#4CAF50",
        "Nemli": "#3498DB",
        "Çok Nemli": "#9B59B6",
        "Çok Kurak": "#E74C3C"
    };

    mayis.addEventListener("click", function () {
        sehirler.forEach(sehir => {
            const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
            const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][4] : null; // Ocak ayı verisini al
            const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

            if (kuraklik) {
                sehir.querySelector('path').style.fill = renk;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const haziran = document.getElementById("haziran");
    const sehirler = document.querySelectorAll('.city');

    // Tüm şehirlerin kuraklık durumlarını içeren dizi
    const kuraklikVerileri = {
        "ADANA": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "AFYONKARAH�SAR":["Kurak","Kurak","Yarı Kurak", "Yarı Kurak",  "Yarı Nemli","Yarı Nemli","Yarı Kurak","Kurak","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli"],
        "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "AGRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "AMASYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANTALYA": ['Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "ARDAHAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "ARTVIN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "AYDIN": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "BALIKESIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "BARTIN": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BATMAN": ['Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
        "BAYBURT": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "BILECIK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BINGOL": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Nemli'],
        "BITLIS": ['Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BOLU": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "BURSA": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANAKKALE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak'],
        "CORUM": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "DENIZLI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "DIYARBAKIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "DUZCE": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "EDIRNE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "ELAZIG": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
        "ERZINCAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ERZURUM": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ESKISEHIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "GAZIANTEP": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "GIRESUN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
        "GUMUSHANE": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "HAKKARI": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "HATAY": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
        "ICEL": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "IGDIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli'],
        "ISTANBUL": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KARABUK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KARS": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "KASTAMONU": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "KAYSERI": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
        "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRIKKALE": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KIRKLARELI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KOCAELI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "KONYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KUTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "MALATYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "MARDIN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli'],
        "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "MUS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "NIGDE": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ORDU": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "OSMANIYE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
        "SAKARYA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "SAMSUN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SANLIURFA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
        "SIIRT": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SINOP": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SIRNAK": ['Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SIVAS": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "TRABZON": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli'],
        "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "VAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "YALOVA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "ZONGULDAK": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
    };

    const renkler = {
        "Kurak": "#FF5733",
        "Yarı Kurak": "#FFC300",
        "Yarı Nemli": "#4CAF50",
        "Nemli": "#3498DB",
        "Çok Nemli": "#9B59B6",
        "Çok Kurak": "#E74C3C"
    };

    haziran.addEventListener("click", function () {
        sehirler.forEach(sehir => {
            const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
            const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][5] : null; // Ocak ayı verisini al
            const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

            if (kuraklik) {
                sehir.querySelector('path').style.fill = renk;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const temmuz = document.getElementById("temmuz");
    const sehirler = document.querySelectorAll('.city');

    // Tüm şehirlerin kuraklık durumlarını içeren dizi
    const kuraklikVerileri = {
        "ADANA": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "AFYONKARAH�SAR":["Kurak","Kurak","Yarı Kurak", "Yarı Kurak",  "Yarı Nemli","Yarı Nemli","Yarı Kurak","Kurak","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli"],
        "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "AGRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "AMASYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANTALYA": ['Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "ARDAHAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "ARTVIN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "AYDIN": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "BALIKESIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "BARTIN": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BATMAN": ['Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
        "BAYBURT": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "BILECIK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BINGOL": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Nemli'],
        "BITLIS": ['Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BOLU": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "BURSA": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANAKKALE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak'],
        "CORUM": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "DENIZLI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "DIYARBAKIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "DUZCE": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "EDIRNE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "ELAZIG": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
        "ERZINCAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ERZURUM": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ESKISEHIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "GAZIANTEP": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "GIRESUN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
        "GUMUSHANE": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "HAKKARI": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "HATAY": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
        "ICEL": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "IGDIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli'],
        "ISTANBUL": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KARABUK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KARS": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "KASTAMONU": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "KAYSERI": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
        "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRIKKALE": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KIRKLARELI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KOCAELI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "KONYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KUTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "MALATYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "MARDIN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli'],
        "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "MUS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "NIGDE": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ORDU": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "OSMANIYE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
        "SAKARYA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "SAMSUN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SANLIURFA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
        "SIIRT": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SINOP": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SIRNAK": ['Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SIVAS": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "TRABZON": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli'],
        "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "VAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "YALOVA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "ZONGULDAK": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
    };

    const renkler = {
        "Kurak": "#FF5733",
        "Yarı Kurak": "#FFC300",
        "Yarı Nemli": "#4CAF50",
        "Nemli": "#3498DB",
        "Çok Nemli": "#9B59B6",
        "Çok Kurak": "#E74C3C"
    };

    temmuz.addEventListener("click", function () {
        sehirler.forEach(sehir => {
            const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
            const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][6] : null; // Ocak ayı verisini al
            const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

            if (kuraklik) {
                sehir.querySelector('path').style.fill = renk;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const agustos = document.getElementById("agustos");
    const sehirler = document.querySelectorAll('.city');

    // Tüm şehirlerin kuraklık durumlarını içeren dizi
    const kuraklikVerileri = {
        "ADANA": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "AFYONKARAH�SAR":["Kurak","Kurak","Yarı Kurak", "Yarı Kurak",  "Yarı Nemli","Yarı Nemli","Yarı Kurak","Kurak","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli"],
        "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "AGRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "AMASYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANTALYA": ['Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "ARDAHAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "ARTVIN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "AYDIN": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "BALIKESIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "BARTIN": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BATMAN": ['Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
        "BAYBURT": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "BILECIK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BINGOL": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Nemli'],
        "BITLIS": ['Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BOLU": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "BURSA": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANAKKALE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak'],
        "CORUM": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "DENIZLI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "DIYARBAKIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "DUZCE": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "EDIRNE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "ELAZIG": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
        "ERZINCAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ERZURUM": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ESKISEHIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "GAZIANTEP": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "GIRESUN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
        "GUMUSHANE": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "HAKKARI": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "HATAY": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
        "ICEL": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "IGDIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli'],
        "ISTANBUL": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KARABUK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KARS": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "KASTAMONU": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "KAYSERI": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
        "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRIKKALE": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KIRKLARELI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KOCAELI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "KONYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KUTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "MALATYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "MARDIN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli'],
        "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "MUS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "NIGDE": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ORDU": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "OSMANIYE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
        "SAKARYA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "SAMSUN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SANLIURFA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
        "SIIRT": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SINOP": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SIRNAK": ['Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SIVAS": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "TRABZON": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli'],
        "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "VAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "YALOVA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "ZONGULDAK": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
    };

    const renkler = {
        "Kurak": "#FF5733",
        "Yarı Kurak": "#FFC300",
        "Yarı Nemli": "#4CAF50",
        "Nemli": "#3498DB",
        "Çok Nemli": "#9B59B6",
        "Çok Kurak": "#E74C3C"
    };

    agustos.addEventListener("click", function () {
        sehirler.forEach(sehir => {
            const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
            const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][7] : null; // Ocak ayı verisini al
            const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

            if (kuraklik) {
                sehir.querySelector('path').style.fill = renk;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const eylul = document.getElementById("eylul");
    const sehirler = document.querySelectorAll('.city');

    // Tüm şehirlerin kuraklık durumlarını içeren dizi
    const kuraklikVerileri = {
        "ADANA": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "AFYONKARAH�SAR":["Kurak","Kurak","Yarı Kurak", "Yarı Kurak",  "Yarı Nemli","Yarı Nemli","Yarı Kurak","Kurak","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli"],
        "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "AGRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "AMASYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANTALYA": ['Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "ARDAHAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "ARTVIN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "AYDIN": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "BALIKESIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "BARTIN": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BATMAN": ['Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
        "BAYBURT": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "BILECIK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BINGOL": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Nemli'],
        "BITLIS": ['Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BOLU": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "BURSA": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANAKKALE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak'],
        "CORUM": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "DENIZLI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "DIYARBAKIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "DUZCE": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "EDIRNE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "ELAZIG": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
        "ERZINCAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ERZURUM": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ESKISEHIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "GAZIANTEP": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "GIRESUN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
        "GUMUSHANE": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "HAKKARI": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "HATAY": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
        "ICEL": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "IGDIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli'],
        "ISTANBUL": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KARABUK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KARS": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "KASTAMONU": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "KAYSERI": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
        "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRIKKALE": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KIRKLARELI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KOCAELI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "KONYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KUTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "MALATYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "MARDIN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli'],
        "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "MUS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "NIGDE": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ORDU": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "OSMANIYE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
        "SAKARYA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "SAMSUN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SANLIURFA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
        "SIIRT": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SINOP": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SIRNAK": ['Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SIVAS": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "TRABZON": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli'],
        "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "VAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "YALOVA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "ZONGULDAK": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
    };

    const renkler = {
        "Kurak": "#FF5733",
        "Yarı Kurak": "#FFC300",
        "Yarı Nemli": "#4CAF50",
        "Nemli": "#3498DB",
        "Çok Nemli": "#9B59B6",
        "Çok Kurak": "#E74C3C"
    };

    eylul.addEventListener("click", function () {
        sehirler.forEach(sehir => {
            const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
            const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][8] : null; // Ocak ayı verisini al
            const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

            if (kuraklik) {
                sehir.querySelector('path').style.fill = renk;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const ekim = document.getElementById("ekim");
    const sehirler = document.querySelectorAll('.city');

    // Tüm şehirlerin kuraklık durumlarını içeren dizi
    const kuraklikVerileri = {
        "ADANA": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "AFYONKARAH�SAR":["Kurak","Kurak","Yarı Kurak", "Yarı Kurak",  "Yarı Nemli","Yarı Nemli","Yarı Kurak","Kurak","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli"],
        "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "AGRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "AMASYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANTALYA": ['Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "ARDAHAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "ARTVIN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "AYDIN": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "BALIKESIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "BARTIN": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BATMAN": ['Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
        "BAYBURT": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "BILECIK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BINGOL": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Nemli'],
        "BITLIS": ['Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BOLU": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "BURSA": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANAKKALE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak'],
        "CORUM": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "DENIZLI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "DIYARBAKIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "DUZCE": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "EDIRNE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "ELAZIG": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
        "ERZINCAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ERZURUM": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ESKISEHIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "GAZIANTEP": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "GIRESUN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
        "GUMUSHANE": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "HAKKARI": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "HATAY": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
        "ICEL": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "IGDIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli'],
        "ISTANBUL": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KARABUK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KARS": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "KASTAMONU": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "KAYSERI": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
        "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRIKKALE": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KIRKLARELI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KOCAELI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "KONYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KUTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "MALATYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "MARDIN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli'],
        "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "MUS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "NIGDE": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ORDU": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "OSMANIYE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
        "SAKARYA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "SAMSUN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SANLIURFA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
        "SIIRT": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SINOP": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SIRNAK": ['Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SIVAS": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "TRABZON": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli'],
        "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "VAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "YALOVA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "ZONGULDAK": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
    };

    const renkler = {
        "Kurak": "#FF5733",
        "Yarı Kurak": "#FFC300",
        "Yarı Nemli": "#4CAF50",
        "Nemli": "#3498DB",
        "Çok Nemli": "#9B59B6",
        "Çok Kurak": "#E74C3C"
    };

    ekim.addEventListener("click", function () {
        sehirler.forEach(sehir => {
            const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
            const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][9] : null; // Ocak ayı verisini al
            const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

            if (kuraklik) {
                sehir.querySelector('path').style.fill = renk;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const kasim = document.getElementById("kasim");
    const sehirler = document.querySelectorAll('.city');

    // Tüm şehirlerin kuraklık durumlarını içeren dizi
    const kuraklikVerileri = {
        "ADANA": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "AFYONKARAH�SAR":["Kurak","Kurak","Yarı Kurak", "Yarı Kurak",  "Yarı Nemli","Yarı Nemli","Yarı Kurak","Kurak","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli"],
        "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "AGRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "AMASYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANTALYA": ['Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "ARDAHAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "ARTVIN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "AYDIN": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "BALIKESIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "BARTIN": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BATMAN": ['Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
        "BAYBURT": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "BILECIK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BINGOL": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Nemli'],
        "BITLIS": ['Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BOLU": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "BURSA": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANAKKALE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak'],
        "CORUM": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "DENIZLI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "DIYARBAKIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "DUZCE": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "EDIRNE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "ELAZIG": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
        "ERZINCAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ERZURUM": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ESKISEHIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "GAZIANTEP": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "GIRESUN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
        "GUMUSHANE": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "HAKKARI": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "HATAY": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
        "ICEL": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "IGDIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli'],
        "ISTANBUL": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KARABUK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KARS": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "KASTAMONU": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "KAYSERI": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
        "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRIKKALE": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KIRKLARELI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KOCAELI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "KONYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KUTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "MALATYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "MARDIN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli'],
        "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "MUS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "NIGDE": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ORDU": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "OSMANIYE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
        "SAKARYA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "SAMSUN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SANLIURFA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
        "SIIRT": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SINOP": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SIRNAK": ['Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SIVAS": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "TRABZON": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli'],
        "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "VAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "YALOVA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "ZONGULDAK": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
    };

    const renkler = {
        "Kurak": "#FF5733",
        "Yarı Kurak": "#FFC300",
        "Yarı Nemli": "#4CAF50",
        "Nemli": "#3498DB",
        "Çok Nemli": "#9B59B6",
        "Çok Kurak": "#E74C3C"
    };

    kasim.addEventListener("click", function () {
        sehirler.forEach(sehir => {
            const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
            const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][10] : null; // Ocak ayı verisini al
            const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

            if (kuraklik) {
                sehir.querySelector('path').style.fill = renk;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const aralik = document.getElementById("aralik");
    const sehirler = document.querySelectorAll('.city');

    // Tüm şehirlerin kuraklık durumlarını içeren dizi
    const kuraklikVerileri = {
        "ADANA": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "AFYONKARAH�SAR":["Kurak","Kurak","Yarı Kurak", "Yarı Kurak",  "Yarı Nemli","Yarı Nemli","Yarı Kurak","Kurak","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli"],
        "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "AGRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "AMASYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ANTALYA": ['Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "ARDAHAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "ARTVIN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "AYDIN": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "BALIKESIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "BARTIN": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BATMAN": ['Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
        "BAYBURT": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "BILECIK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BINGOL": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Nemli'],
        "BITLIS": ['Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "BOLU": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "BURSA": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANAKKALE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "CANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak'],
        "CORUM": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "DENIZLI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "DIYARBAKIR": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "DUZCE": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "EDIRNE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "ELAZIG": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
        "ERZINCAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ERZURUM": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "ESKISEHIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "GAZIANTEP": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
        "GIRESUN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
        "GUMUSHANE": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "HAKKARI": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "HATAY": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
        "ICEL": ['Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "IGDIR": ['Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli'],
        "ISTANBUL": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "KARABUK": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KARS": ['Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak'],
        "KASTAMONU": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak'],
        "KAYSERI": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
        "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRIKKALE": ['Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KIRKLARELI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KOCAELI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "KONYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "KUTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "MALATYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
        "MARDIN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Nemli', 'Nemli'],
        "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
        "MUS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "NIGDE": ['Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "ORDU": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli'],
        "OSMANIYE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
        "SAKARYA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "SAMSUN": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SANLIURFA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
        "SIIRT": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SINOP": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "SIRNAK": ['Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Nemli'],
        "SIVAS": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
        "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
        "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
        "TRABZON": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Yarı Nemli'],
        "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
        "VAN": ['Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Kurak'],
        "YALOVA": ['Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli'],
        "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
        "ZONGULDAK": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli'],
    };

    
    const renkler = {
        "Kurak": "#FF5733",
        "Yarı Kurak": "#FFC300",
        "Yarı Nemli": "#4CAF50",
        "Nemli": "#3498DB",
        "Çok Nemli": "#9B59B6",
        "Çok Kurak": "#E74C3C"
    };

    aralik.addEventListener("click", function () {
        sehirler.forEach(sehir => {
            const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
            const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][11] : null; // Ocak ayı verisini al
            const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

            if (kuraklik) {
                sehir.querySelector('path').style.fill = renk;
            }
        });
    });
});



// document.addEventListener("DOMContentLoaded", function () {
//     const ocak2 = document.getElementById("ocak2");
//     const sehirler = document.querySelectorAll('.city');

//     // Tüm şehirlerin kuraklık durumlarını içeren dizi
//     const kuraklikVerileri = {
//         "ADANA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AFYONKARAHISAR":["Kurak","Yarı Kurak","Yarı Kurak", "Kurak",  "Yarı Nemli","Nemli","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli","Yarı Nemli","Nemli"],
//         "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AGRI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "AMASYA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ANTALYA": ['Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "ARDAHAN": ['Yarı Kurak', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ARTVIN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "AYDIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BALIKESIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "BARTIN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "BATMAN": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
//         "BAYBURT": ['Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "BILECIK": ['Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BINGOL": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BITLIS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BOLU": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "BURSA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANAKKALE": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "CANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "CORUM": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "DENIZLI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "DIYARBAKIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
//         "DZCE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "EDIRNE": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "ELAZIG": ['Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZINCAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZURUM": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ESKISEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "GAZIANTEP": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "GIRESUN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "GÜMÜSHANE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "HAKKARI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "HATAY": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "MERSIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IĞDIR": ['Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak'],
//         "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ISTANBUL": ['Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KARABUK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KARS": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KASTAMONU": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KAYSERI": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "KIRIKKALE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KIRKLARELI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KOCAELI": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "KONYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KUTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MALATYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
//         "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "MARDIN": ['Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "MUS": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "NIGDE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ORDU": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "OSMANIYE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "SAKARYA": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SAMSUN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SANLIURFA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "SIIRT": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SINOP": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "SIRNAK": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SIVAS": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TRABZON": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "VAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "YALOVA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ZONGULDAK": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],

//         // Diğer şehirlerin kuraklık verileri buraya eklenebilir...
//     };

    

//     const renkler = {
//         "Kurak": "#FF5733",
//         "Yarı Kurak": "#FFC300",
//         "Yarı Nemli": "#4CAF50",
//         "Nemli": "#3498DB",
//         "Çok Nemli": "#9B59B6",
//         "Çok Kurak": "#E74C3C"
//     };

//     ocak2.addEventListener("click", function () {
//         sehirler.forEach(sehir => {
//             const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
//             const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][0] : null; // Ocak ayı verisini al
//             const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

//             if (kuraklik) {
//                 sehir.querySelector('path').style.fill = renk;
//             }
//         });
//     });
// });


// document.addEventListener("DOMContentLoaded", function () {
//     const subat2 = document.getElementById("subat2");
//     const sehirler = document.querySelectorAll('.city');

//     // Tüm şehirlerin kuraklık durumlarını içeren dizi
//     const kuraklikVerileri = {
//         "ADANA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AFYONKARAHISAR":["Kurak","Yarı Kurak","Yarı Kurak", "Kurak",  "Yarı Nemli","Nemli","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli","Yarı Nemli","Nemli"],
//         "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AĞRI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "AMASYA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ANTALYA": ['Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "ARDAHAN": ['Yarı Kurak', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ARTVIN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "AYDIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BALIKESIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "BARTIN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "BATMAN": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
//         "BAYBURT": ['Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "BILECIK": ['Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BINGOL": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BITLIS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BOLU": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "BURSA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANAKKALE": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ÇORUM": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "DENIZLI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "DIYARBAKIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
//         "DÜZCE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "EDIRNE": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "ELAZIG": ['Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZINCAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZURUM": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ESKISEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "GAZIANTEP": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "GIRESUN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "GÜMÜSHANE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "HAKKARI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "HATAY": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "MERSIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IĞDIR": ['Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak'],
//         "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ISTANBUL": ['Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KARABÜK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KARS": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KASTAMONU": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KAYSERI": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "KIRIKKALE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KIRKLARELI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KOCAELI": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "KONYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KÜTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MALATYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
//         "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "MARDIN": ['Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "MUS": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "NIGDE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ORDU": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "OSMANIYE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "SAKARYA": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SAMSUN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SANLIURFA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "SIIRT": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SINOP": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "SIRNAK": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SIVAS": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TRABZON": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "VAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "YALOVA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ZONGULDAK": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//     };

    

//     const renkler = {
//         "Kurak": "#FF5733",
//         "Yarı Kurak": "#FFC300",
//         "Yarı Nemli": "#4CAF50",
//         "Nemli": "#3498DB",
//         "Çok Nemli": "#9B59B6",
//         "Çok Kurak": "#E74C3C"
//     };

//     subat2.addEventListener("click", function () {
//         sehirler.forEach(sehir => {
//             const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
//             const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][1] : null; // Ocak ayı verisini al
//             const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

//             if (kuraklik) {
//                 sehir.querySelector('path').style.fill = renk;
//             }
//         });
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const mart2 = document.getElementById("mart2");
//     const sehirler = document.querySelectorAll('.city');

//     // Tüm şehirlerin kuraklık durumlarını içeren dizi
//     const kuraklikVerileri = {
//         "ADANA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AFYONKARAHISAR":["Kurak","Yarı Kurak","Yarı Kurak", "Kurak",  "Yarı Nemli","Nemli","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli","Yarı Nemli","Nemli"],
//         "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AĞRI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "AMASYA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ANTALYA": ['Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "ARDAHAN": ['Yarı Kurak', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ARTVIN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "AYDIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BALIKESIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "BARTIN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "BATMAN": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
//         "BAYBURT": ['Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "BILECIK": ['Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BINGOL": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BITLIS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BOLU": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "BURSA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANAKKALE": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ÇORUM": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "DENIZLI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "DIYARBAKIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
//         "DÜZCE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "EDIRNE": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "ELAZIG": ['Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZINCAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZURUM": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ESKISEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "GAZIANTEP": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "GIRESUN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "GÜMÜSHANE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "HAKKARI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "HATAY": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "MERSIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IĞDIR": ['Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak'],
//         "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ISTANBUL": ['Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KARABÜK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KARS": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KASTAMONU": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KAYSERI": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "KIRIKKALE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KIRKLARELI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KOCAELI": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "KONYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KÜTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MALATYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
//         "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "MARDIN": ['Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "MUS": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "NIGDE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ORDU": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "OSMANIYE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "SAKARYA": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SAMSUN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SANLIURFA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "SIIRT": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SINOP": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "SIRNAK": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SIVAS": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TRABZON": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "VAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "YALOVA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ZONGULDAK": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//     };

    

//     const renkler = {
//         "Kurak": "#FF5733",
//         "Yarı Kurak": "#FFC300",
//         "Yarı Nemli": "#4CAF50",
//         "Nemli": "#3498DB",
//         "Çok Nemli": "#9B59B6",
//         "Çok Kurak": "#E74C3C"
//     };

//     mart2.addEventListener("click", function () {
//         sehirler.forEach(sehir => {
//             const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
//             const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][2] : null; // Ocak ayı verisini al
//             const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

//             if (kuraklik) {
//                 sehir.querySelector('path').style.fill = renk;
//             }
//         });
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const nisan2 = document.getElementById("nisan2");
//     const sehirler = document.querySelectorAll('.city');

//     // Tüm şehirlerin kuraklık durumlarını içeren dizi
//     const kuraklikVerileri = {
//         "ADANA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AFYONKARAHISAR":["Kurak","Yarı Kurak","Yarı Kurak", "Kurak",  "Yarı Nemli","Nemli","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli","Yarı Nemli","Nemli"],
//         "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AĞRI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "AMASYA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ANTALYA": ['Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "ARDAHAN": ['Yarı Kurak', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ARTVIN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "AYDIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BALIKESIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "BARTIN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "BATMAN": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
//         "BAYBURT": ['Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "BILECIK": ['Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BINGOL": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BITLIS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BOLU": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "BURSA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANAKKALE": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ÇORUM": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "DENIZLI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "DIYARBAKIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
//         "DÜZCE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "EDIRNE": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "ELAZIG": ['Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZINCAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZURUM": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ESKISEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "GAZIANTEP": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "GIRESUN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "GÜMÜSHANE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "HAKKARI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "HATAY": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "MERSIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IĞDIR": ['Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak'],
//         "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ISTANBUL": ['Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KARABÜK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KARS": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KASTAMONU": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KAYSERI": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "KIRIKKALE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KIRKLARELI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KOCAELI": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "KONYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KÜTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MALATYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
//         "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "MARDIN": ['Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "MUS": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "NIGDE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ORDU": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "OSMANIYE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "SAKARYA": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SAMSUN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SANLIURFA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "SIIRT": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SINOP": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "SIRNAK": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SIVAS": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TRABZON": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "VAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "YALOVA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ZONGULDAK": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//     };

    

//     const renkler = {
//         "Kurak": "#FF5733",
//         "Yarı Kurak": "#FFC300",
//         "Yarı Nemli": "#4CAF50",
//         "Nemli": "#3498DB",
//         "Çok Nemli": "#9B59B6",
//         "Çok Kurak": "#E74C3C"
//     };

//     nisan2.addEventListener("click", function () {
//         sehirler.forEach(sehir => {
//             const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
//             const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][3] : null; // Ocak ayı verisini al
//             const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

//             if (kuraklik) {
//                 sehir.querySelector('path').style.fill = renk;
//             }
//         });
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const mayis2 = document.getElementById("mayis2");
//     const sehirler = document.querySelectorAll('.city');

//     // Tüm şehirlerin kuraklık durumlarını içeren dizi
//     const kuraklikVerileri = {
//         "ADANA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AFYONKARAHISAR":["Kurak","Yarı Kurak","Yarı Kurak", "Kurak",  "Yarı Nemli","Nemli","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli","Yarı Nemli","Nemli"],
//         "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AĞRI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "AMASYA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ANTALYA": ['Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "ARDAHAN": ['Yarı Kurak', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ARTVIN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "AYDIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BALIKESIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "BARTIN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "BATMAN": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
//         "BAYBURT": ['Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "BILECIK": ['Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BINGOL": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BITLIS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BOLU": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "BURSA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANAKKALE": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ÇORUM": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "DENIZLI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "DIYARBAKIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
//         "DÜZCE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "EDIRNE": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "ELAZIG": ['Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZINCAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZURUM": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ESKISEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "GAZIANTEP": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "GIRESUN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "GÜMÜSHANE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "HAKKARI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "HATAY": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "MERSIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IĞDIR": ['Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak'],
//         "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ISTANBUL": ['Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KARABÜK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KARS": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KASTAMONU": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KAYSERI": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "KIRIKKALE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KIRKLARELI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KOCAELI": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "KONYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KÜTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MALATYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
//         "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "MARDIN": ['Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "MUS": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "NIGDE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ORDU": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "OSMANIYE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "SAKARYA": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SAMSUN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SANLIURFA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "SIIRT": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SINOP": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "SIRNAK": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SIVAS": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TRABZON": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "VAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "YALOVA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ZONGULDAK": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//     };

    

//     const renkler = {
//         "Kurak": "#FF5733",
//         "Yarı Kurak": "#FFC300",
//         "Yarı Nemli": "#4CAF50",
//         "Nemli": "#3498DB",
//         "Çok Nemli": "#9B59B6",
//         "Çok Kurak": "#E74C3C"
//     };

//     mayis2.addEventListener("click", function () {
//         sehirler.forEach(sehir => {
//             const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
//             const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][4] : null; // Ocak ayı verisini al
//             const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

//             if (kuraklik) {
//                 sehir.querySelector('path').style.fill = renk;
//             }
//         });
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const haziran2 = document.getElementById("haziran2");
//     const sehirler = document.querySelectorAll('.city');

//     // Tüm şehirlerin kuraklık durumlarını içeren dizi
//     const kuraklikVerileri = {
//         "ADANA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AFYONKARAHISAR":["Kurak","Yarı Kurak","Yarı Kurak", "Kurak",  "Yarı Nemli","Nemli","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli","Yarı Nemli","Nemli"],
//         "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AĞRI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "AMASYA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ANTALYA": ['Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "ARDAHAN": ['Yarı Kurak', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ARTVIN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "AYDIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BALIKESIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "BARTIN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "BATMAN": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
//         "BAYBURT": ['Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "BILECIK": ['Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BINGOL": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BITLIS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BOLU": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "BURSA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANAKKALE": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ÇORUM": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "DENIZLI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "DIYARBAKIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
//         "DÜZCE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "EDIRNE": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "ELAZIG": ['Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZINCAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZURUM": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ESKISEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "GAZIANTEP": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "GIRESUN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "GÜMÜSHANE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "HAKKARI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "HATAY": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "MERSIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IĞDIR": ['Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak'],
//         "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ISTANBUL": ['Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KARABÜK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KARS": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KASTAMONU": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KAYSERI": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "KIRIKKALE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KIRKLARELI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KOCAELI": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "KONYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KÜTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MALATYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
//         "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "MARDIN": ['Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "MUS": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "NIGDE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ORDU": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "OSMANIYE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "SAKARYA": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SAMSUN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SANLIURFA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "SIIRT": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SINOP": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "SIRNAK": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SIVAS": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TRABZON": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "VAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "YALOVA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ZONGULDAK": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//     };

    

//     const renkler = {
//         "Kurak": "#FF5733",
//         "Yarı Kurak": "#FFC300",
//         "Yarı Nemli": "#4CAF50",
//         "Nemli": "#3498DB",
//         "Çok Nemli": "#9B59B6",
//         "Çok Kurak": "#E74C3C"
//     };

//     haziran2.addEventListener("click", function () {
//         sehirler.forEach(sehir => {
//             const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
//             const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][5] : null; // Ocak ayı verisini al
//             const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

//             if (kuraklik) {
//                 sehir.querySelector('path').style.fill = renk;
//             }
//         });
//     });
// });


// document.addEventListener("DOMContentLoaded", function () {
//     const temmuz2 = document.getElementById("temmuz2");
//     const sehirler = document.querySelectorAll('.city');

//     // Tüm şehirlerin kuraklık durumlarını içeren dizi
//     const kuraklikVerileri = {
//         "ADANA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AFYONKARAHISAR":["Kurak","Yarı Kurak","Yarı Kurak", "Kurak",  "Yarı Nemli","Nemli","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli","Yarı Nemli","Nemli"],
//         "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AĞRI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "AMASYA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ANTALYA": ['Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "ARDAHAN": ['Yarı Kurak', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ARTVIN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "AYDIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BALIKESIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "BARTIN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "BATMAN": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
//         "BAYBURT": ['Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "BILECIK": ['Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BINGOL": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BITLIS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BOLU": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "BURSA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANAKKALE": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ÇORUM": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "DENIZLI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "DIYARBAKIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
//         "DÜZCE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "EDIRNE": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "ELAZIG": ['Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZINCAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZURUM": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ESKISEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "GAZIANTEP": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "GIRESUN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "GÜMÜSHANE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "HAKKARI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "HATAY": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "MERSIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IĞDIR": ['Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak'],
//         "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ISTANBUL": ['Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KARABÜK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KARS": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KASTAMONU": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KAYSERI": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "KIRIKKALE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KIRKLARELI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KOCAELI": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "KONYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KÜTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MALATYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
//         "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "MARDIN": ['Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "MUS": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "NIGDE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ORDU": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "OSMANIYE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "SAKARYA": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SAMSUN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SANLIURFA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "SIIRT": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SINOP": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "SIRNAK": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SIVAS": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TRABZON": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "VAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "YALOVA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ZONGULDAK": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//     };

    

//     const renkler = {
//         "Kurak": "#FF5733",
//         "Yarı Kurak": "#FFC300",
//         "Yarı Nemli": "#4CAF50",
//         "Nemli": "#3498DB",
//         "Çok Nemli": "#9B59B6",
//         "Çok Kurak": "#E74C3C"
//     };

//     temmuz2.addEventListener("click", function () {
//         sehirler.forEach(sehir => {
//             const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
//             const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][6] : null; // Ocak ayı verisini al
//             const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

//             if (kuraklik) {
//                 sehir.querySelector('path').style.fill = renk;
//             }
//         });
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const agustos2 = document.getElementById("agustos2");
//     const sehirler = document.querySelectorAll('.city');

//     // Tüm şehirlerin kuraklık durumlarını içeren dizi
//     const kuraklikVerileri = {
//         "ADANA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AFYONKARAHISAR":["Kurak","Yarı Kurak","Yarı Kurak", "Kurak",  "Yarı Nemli","Nemli","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli","Yarı Nemli","Nemli"],
//         "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AĞRI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "AMASYA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ANTALYA": ['Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "ARDAHAN": ['Yarı Kurak', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ARTVIN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "AYDIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BALIKESIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "BARTIN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "BATMAN": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
//         "BAYBURT": ['Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "BILECIK": ['Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BINGOL": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BITLIS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BOLU": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "BURSA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANAKKALE": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ÇORUM": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "DENIZLI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "DIYARBAKIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
//         "DÜZCE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "EDIRNE": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "ELAZIG": ['Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZINCAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZURUM": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ESKISEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "GAZIANTEP": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "GIRESUN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "GÜMÜSHANE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "HAKKARI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "HATAY": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "MERSIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IĞDIR": ['Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak'],
//         "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ISTANBUL": ['Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KARABÜK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KARS": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KASTAMONU": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KAYSERI": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "KIRIKKALE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KIRKLARELI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KOCAELI": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "KONYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KÜTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MALATYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
//         "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "MARDIN": ['Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "MUS": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "NIGDE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ORDU": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "OSMANIYE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "SAKARYA": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SAMSUN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SANLIURFA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "SIIRT": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SINOP": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "SIRNAK": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SIVAS": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TRABZON": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "VAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "YALOVA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ZONGULDAK": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//     };

    

//     const renkler = {
//         "Kurak": "#FF5733",
//         "Yarı Kurak": "#FFC300",
//         "Yarı Nemli": "#4CAF50",
//         "Nemli": "#3498DB",
//         "Çok Nemli": "#9B59B6",
//         "Çok Kurak": "#E74C3C"
//     };

//     agustos2.addEventListener("click", function () {
//         sehirler.forEach(sehir => {
//             const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
//             const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][7] : null; // Ocak ayı verisini al
//             const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

//             if (kuraklik) {
//                 sehir.querySelector('path').style.fill = renk;
//             }
//         });
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const eylul2 = document.getElementById("eylul2");
//     const sehirler = document.querySelectorAll('.city');

//     // Tüm şehirlerin kuraklık durumlarını içeren dizi
//     const kuraklikVerileri = {
//         "ADANA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AFYONKARAHISAR":["Kurak","Yarı Kurak","Yarı Kurak", "Kurak",  "Yarı Nemli","Nemli","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli","Yarı Nemli","Nemli"],
//         "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AĞRI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "AMASYA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ANTALYA": ['Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "ARDAHAN": ['Yarı Kurak', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ARTVIN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "AYDIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BALIKESIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "BARTIN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "BATMAN": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
//         "BAYBURT": ['Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "BILECIK": ['Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BINGOL": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BITLIS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BOLU": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "BURSA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANAKKALE": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ÇORUM": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "DENIZLI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "DIYARBAKIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
//         "DÜZCE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "EDIRNE": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "ELAZIG": ['Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZINCAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZURUM": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ESKISEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "GAZIANTEP": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "GIRESUN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "GÜMÜSHANE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "HAKKARI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "HATAY": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "MERSIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IĞDIR": ['Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak'],
//         "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ISTANBUL": ['Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KARABÜK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KARS": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KASTAMONU": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KAYSERI": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "KIRIKKALE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KIRKLARELI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KOCAELI": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "KONYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KÜTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MALATYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
//         "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "MARDIN": ['Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "MUS": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "NIGDE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ORDU": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "OSMANIYE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "SAKARYA": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SAMSUN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SANLIURFA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "SIIRT": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SINOP": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "SIRNAK": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SIVAS": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TRABZON": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "VAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "YALOVA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ZONGULDAK": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//     };

    

//     const renkler = {
//         "Kurak": "#FF5733",
//         "Yarı Kurak": "#FFC300",
//         "Yarı Nemli": "#4CAF50",
//         "Nemli": "#3498DB",
//         "Çok Nemli": "#9B59B6",
//         "Çok Kurak": "#E74C3C"
//     };

//     eylul2.addEventListener("click", function () {
//         sehirler.forEach(sehir => {
//             const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
//             const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][8] : null; // Ocak ayı verisini al
//             const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

//             if (kuraklik) {
//                 sehir.querySelector('path').style.fill = renk;
//             }
//         });
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const ekim2 = document.getElementById("ekim2");
//     const sehirler = document.querySelectorAll('.city');

//     // Tüm şehirlerin kuraklık durumlarını içeren dizi
//     const kuraklikVerileri = {
//         "ADANA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AFYONKARAHISAR":["Kurak","Yarı Kurak","Yarı Kurak", "Kurak",  "Yarı Nemli","Nemli","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli","Yarı Nemli","Nemli"],
//         "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AĞRI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "AMASYA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ANTALYA": ['Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "ARDAHAN": ['Yarı Kurak', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ARTVIN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "AYDIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BALIKESIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "BARTIN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "BATMAN": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
//         "BAYBURT": ['Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "BILECIK": ['Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BINGOL": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BITLIS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BOLU": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "BURSA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANAKKALE": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ÇORUM": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "DENIZLI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "DIYARBAKIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
//         "DÜZCE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "EDIRNE": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "ELAZIG": ['Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZINCAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZURUM": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ESKISEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "GAZIANTEP": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "GIRESUN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "GÜMÜSHANE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "HAKKARI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "HATAY": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "MERSIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IĞDIR": ['Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak'],
//         "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ISTANBUL": ['Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KARABÜK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KARS": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KASTAMONU": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KAYSERI": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "KIRIKKALE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KIRKLARELI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KOCAELI": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "KONYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KÜTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MALATYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
//         "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "MARDIN": ['Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "MUS": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "NIGDE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ORDU": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "OSMANIYE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "SAKARYA": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SAMSUN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SANLIURFA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "SIIRT": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SINOP": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "SIRNAK": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SIVAS": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TRABZON": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "VAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "YALOVA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ZONGULDAK": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//     };

    

//     const renkler = {
//         "Kurak": "#FF5733",
//         "Yarı Kurak": "#FFC300",
//         "Yarı Nemli": "#4CAF50",
//         "Nemli": "#3498DB",
//         "Çok Nemli": "#9B59B6",
//         "Çok Kurak": "#E74C3C"
//     };

//     ekim2.addEventListener("click", function () {
//         sehirler.forEach(sehir => {
//             const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
//             const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][9] : null; // Ocak ayı verisini al
//             const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

//             if (kuraklik) {
//                 sehir.querySelector('path').style.fill = renk;
//             }
//         });
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const kasim2 = document.getElementById("kasim2");
//     const sehirler = document.querySelectorAll('.city');

//     // Tüm şehirlerin kuraklık durumlarını içeren dizi
//     const kuraklikVerileri = {
//         "ADANA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AFYONKARAHISAR":["Kurak","Yarı Kurak","Yarı Kurak", "Kurak",  "Yarı Nemli","Nemli","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli","Yarı Nemli","Nemli"],
//         "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AĞRI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "AMASYA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ANTALYA": ['Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "ARDAHAN": ['Yarı Kurak', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ARTVIN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "AYDIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BALIKESIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "BARTIN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "BATMAN": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
//         "BAYBURT": ['Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "BILECIK": ['Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BINGOL": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BITLIS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BOLU": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "BURSA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANAKKALE": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ÇORUM": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "DENIZLI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "DIYARBAKIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
//         "DÜZCE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "EDIRNE": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "ELAZIG": ['Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZINCAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZURUM": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ESKISEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "GAZIANTEP": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "GIRESUN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "GÜMÜSHANE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "HAKKARI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "HATAY": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "MERSIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IĞDIR": ['Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak'],
//         "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ISTANBUL": ['Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KARABÜK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KARS": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KASTAMONU": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KAYSERI": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "KIRIKKALE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KIRKLARELI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KOCAELI": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "KONYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KÜTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MALATYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
//         "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "MARDIN": ['Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "MUS": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "NIGDE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ORDU": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "OSMANIYE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "SAKARYA": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SAMSUN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SANLIURFA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "SIIRT": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SINOP": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "SIRNAK": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SIVAS": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TRABZON": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "VAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "YALOVA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ZONGULDAK": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//     };

    

//     const renkler = {
//         "Kurak": "#FF5733",
//         "Yarı Kurak": "#FFC300",
//         "Yarı Nemli": "#4CAF50",
//         "Nemli": "#3498DB",
//         "Çok Nemli": "#9B59B6",
//         "Çok Kurak": "#E74C3C"
//     };

//     kasim2.addEventListener("click", function () {
//         sehirler.forEach(sehir => {
//             const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
//             const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][10] : null; // Ocak ayı verisini al
//             const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

//             if (kuraklik) {
//                 sehir.querySelector('path').style.fill = renk;
//             }
//         });
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const aralik2 = document.getElementById("aralik2");
//     const sehirler = document.querySelectorAll('.city');

//     // Tüm şehirlerin kuraklık durumlarını içeren dizi
//     const kuraklikVerileri = {
//         "ADANA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AFYONKARAHISAR":["Kurak","Yarı Kurak","Yarı Kurak", "Kurak",  "Yarı Nemli","Nemli","Yarı Kurak","Kurak","Yarı Kurak","Yarı Nemli","Yarı Nemli","Nemli"],
//         "ADIYAMAN": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "AĞRI": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "AKSARAY": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "AMASYA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ANKARA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ANTALYA": ['Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "ARDAHAN": ['Yarı Kurak', 'Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "ARTVIN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "AYDIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BALIKESIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "BARTIN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "BATMAN": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak'],
//         "BAYBURT": ['Yarı Nemli', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "BILECIK": ['Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BINGOL": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BITLIS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "BOLU": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli'],
//         "BURDUR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "BURSA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANAKKALE": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "ÇANKIRI": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ÇORUM": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "DENIZLI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "DIYARBAKIR": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak'],
//         "DÜZCE": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "EDIRNE": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "ELAZIG": ['Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZINCAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ERZURUM": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ESKISEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "GAZIANTEP": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "GIRESUN": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "GÜMÜSHANE": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "HAKKARI": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "HATAY": ['Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "MERSIN": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IĞDIR": ['Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Kurak'],
//         "ISPARTA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ISTANBUL": ['Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "IZMIR": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KAHRAMANMARAS": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "KARABÜK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KARAMAN": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KARS": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Nemli', 'Yarı Nemli', 'Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KASTAMONU": ['Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Kurak', 'Kurak', 'Yarı Nemli', 'Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Kurak', 'Yarı Kurak', 'Yarı Nemli'],
//         "KAYSERI": ['Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KILIS": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "KIRIKKALE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KIRKLARELI": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli'],
//         "KIRSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KOCAELI": ['Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "KONYA": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "KÜTAHYA": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MALATYA": ['Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak'],
//         "MANISA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "MARDIN": ['Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "MUGLA": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "MUS": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli'],
//         "NEVSEHIR": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "NIGDE": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "ORDU": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "OSMANIYE": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "RIZE": ['Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],
//         "SAKARYA": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SAMSUN": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "SANLIURFA": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "SIIRT": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SINOP": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "SIRNAK": ['Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Kurak', 'Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "SIVAS": ['Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TEKIRDAG": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli'],
//         "TOKAT": ['Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak'],
//         "TRABZON": ['Yarı Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "TUNCELI": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli'],
//         "USAK": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "VAN": ['Yarı Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Kurak', 'Yarı Nemli', 'Yarı Kurak'],
//         "YALOVA": ['Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Nemli', 'Yarı Nemli', 'Nemli', 'Nemli', 'Çok Nemli'],
//         "YOZGAT": ['Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli', 'Yarı Nemli'],
//         "ZONGULDAK": ['Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Nemli', 'Nemli', 'Çok Nemli', 'Çok Nemli', 'Çok Nemli'],

//         // Diğer şehirlerin kuraklık verileri buraya eklenebilir...
//     };

    

//     const renkler = {
//         "Kurak": "#FF5733",
//         "Yarı Kurak": "#FFC300",
//         "Yarı Nemli": "#4CAF50",
//         "Nemli": "#3498DB",
//         "Çok Nemli": "#9B59B6",
//         "Çok Kurak": "#E74C3C"
//     };

//     aralik2.addEventListener("click", function () {
//         sehirler.forEach(sehir => {
//             const sehirAdi = sehir.getAttribute('data-cityname').toUpperCase(); // Şehir adını büyük harfe çevir
//             const kuraklik = kuraklikVerileri[sehirAdi] ? kuraklikVerileri[sehirAdi][11] : null; // Ocak ayı verisini al
//             const renk = renkler[kuraklik] || "#FFFFFF"; // Renk bulunamazsa varsayılan renk beyaz

//             if (kuraklik) {
//                 sehir.querySelector('path').style.fill = renk;
//             }
//         });
//     });
// });