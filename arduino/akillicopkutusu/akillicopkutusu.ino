
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

// Set these to run example.
#define FIREBASE_HOST "hellofirebase-16ac9-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "ZnMfZs52vDqDpl5up5EfpMptXZMr0ll2TgeJt3Q5"
char ssid[] = "Ali";    
char pass[] = "22224444";

#include <LedControl.h> 
#define echoPin D2
#define trigPin D1
#define buzzerPin D8 // ESP8266 için D10 pinini kullanmıyoruz, D8 gibi bir pin seçin

// Pin tanımlamaları
#define CLK D6 
#define CS D5
#define DIN D7 
#define MaxSayisi 1
int maximumRange = 50;
int minimumRange = 0;

LedControl led = LedControl(DIN, CLK, CS, MaxSayisi); 
byte images[][8] =
 {{
     0,          //kalp
     B01100110,
     B11111111,
     B11111111,
     B01111110,
     B00111100,
     B00011000
   },
   {
     B00111100,  //uzgun ifade
     B01000010,
     B10100101,
     B10000001,
     B10011001,
     B10100101,
     B01000010,
     B00111100
   },
   {
     B00111100,  //normal ifade
     B01000010,
     B10100101,
     B10000001,
     B10111101,
     B10000001,
     B01000010,
     B00111100
   },
   {
     B00111100,  //gulen ifade
     B01000010,
     B10100101,
     B10000001,
     B10100101,
     B10011001,
     B01000010,
     B00111100
   }
 };

void connectToWiFi() {
  Serial.print("WiFi'ye bağlanıyor ");
  WiFi.begin(ssid, pass);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Bağlandı, IP adresi: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);
  
  // WiFi bağlantısını başlat
  connectToWiFi();

  // Firebase'i başlat
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

  // LED Matrix ayarları
  led.setIntensity(0, 1);  
  led.shutdown(0, false);   
  led.clearDisplay(0);

  // Pin modlarını ayarla
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT); // Buzzer için pinMode ayarını ekleyin
}


void loop() {
  int distance = measureDistance();
  updateFirebase(distance);
  delay(1000); // 1 saniye bekleme
}
int measureDistance() {
  long duration, distance;

  // Trig pinini temizle
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  
  // Trig pinine kısa bir pulse gönder
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Echo pininden pulse süresini ölç
  duration = pulseIn(echoPin, HIGH);
  
  // Sesin hızı (340 m/s) ile pulse süresini kullanarak mesafeyi hesapla
  // Gidiş dönüş süresi olduğu için 2'ye bölünür. Sonuç cm cinsindendir.
  distance = duration / 58.2;

  // Eğer mesafe maksimum veya minimum aralığın dışındaysa, 0 döndür
  if (distance >= maximumRange || distance <= minimumRange) {
    return 0;
  } else {
    return distance;
  }
}
void updateFirebase(int distance) {
  // Çöp kutusunun doluluk durumunu temsil eden bir değişken tanımlayalım.
  String trashStatus;

  if(distance >= 8) {
    MatrixeYazdir(images[3]); // Mutlu yüz
    trashStatus = "Bos"; // Çöp kutusu boş
  } else if(distance >= 5) {
    MatrixeYazdir(images[2]); // Normal yüz
    trashStatus = "Orta"; // Çöp kutusu orta dolulukta
  } else if(distance >= 0) {
    MatrixeYazdir(images[1]); // Üzgün yüz
    trashStatus = "Dolu"; // Çöp kutusu dolu
  } else {
    MatrixeYazdir(images[0]); // Durum dışı bir ifade, kontrol edilmeli
    trashStatus = "Hata"; // Beklenmeyen bir durum
  }

  // Firebase'e mesafe ve çöp kutusunun doluluk durumunu kaydedelim.
  Firebase.setInt("trashLevel", distance);
  Firebase.setString("trashStatus", trashStatus);
}
void MatrixeYazdir(byte* ch) {
 for (int i = 0; i < 8; i++)
   {
     led.setRow(0, i, ch[i]);
   }}
 