#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <DHT.h>
#include <Servo.h>
#include "SoftwareSerial.h"
#include "DFRobotDFPlayerMini.h"
// Firebase projenizin bilgileri.
#define FIREBASE_HOST "hellofirebase-16ac9-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "ZnMfZs52vDqDpl5up5EfpMptXZMr0ll2TgeJt3Q5"
#define WIFI_SSID "Ali"
#define WIFI_PASSWORD "22224444"
static const uint8_t PIN_MP3_TX = D4; // DFPlayer modülünde RX  pinine
static const uint8_t PIN_MP3_RX = D8; // DFPlayer modülünde TX pinine            
SoftwareSerial softwareSerial(PIN_MP3_RX, PIN_MP3_TX);
int valume_degeri =15;
// Oynatıcı objemizi Player adında oluşturuyoruz.
DFRobotDFPlayerMini player;
#define gaz_deger D5
#define titresim 5 
#define LED_PIN D3
#define klima_Pin 10   
#define DHTPIN 4          // What digital pin we're connected to
#define DHTTYPE DHT11     // DHT 11
#define PIR D0   

DHT dht(DHTPIN, DHTTYPE);
float h,t;

Servo motor;
Servo motor2;

void sicaklikNem()
{
   h = dht.readHumidity();
   t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  // You can send any value at any time.
  // Please don't send more that 10 values per second.
  Firebase.setFloat("humidity", h);
    Firebase.setFloat("temperature", t);
}


void isikDegeri()
{

int isik_degeri = analogRead(A0);

 if(isik_degeri<200)
 {
Firebase.setBool("isikDegeri", false);
 }
 else
 {
Firebase.setBool("isikDegeri", true);
 }
}

void aydninlatma()
{
  int ledState = Firebase.getInt("ledState");
  digitalWrite(LED_PIN, ledState); // LED durumunu ayarlama

}

void klima()
{
  int klimaState = Firebase.getInt("klimaState");
  digitalWrite(klima_Pin, klimaState); // LED durumunu ayarlama

}

void AnaKapi()
{
  int AnaKapiState = Firebase.getInt("AnaKapiState");
 motor2.write(AnaKapiState);
}

void parkKapisi()
{
  int parkKapisiState = Firebase.getInt("parkKapisiState");
 motor.write(parkKapisiState);
}

void otoKlima()
{
  int OtoKlimaState = Firebase.getInt("OtoKlimaState");
if (OtoKlimaState == 1)
    {

if(t>=30)
{
 digitalWrite(klima_Pin, 1);
}
      else
      digitalWrite(klima_Pin, 0);
}
}

void dfPlay(){

   int valume_degeri = Firebase.getInt("SesDegeri");

      player.volume(valume_degeri);

String action = Firebase.getString("dfPlayerState");

  if (action == "play") {
    // Do something
     player.start();
  }
  if (action == "stop") {
    // Do something
 
      player.pause();
  }
  if (action == "next") {
    // Do something
      player.next(); 
  }
  if (action == "prev") {
    // Do something
    player.previous();
  }
}


void deprem() {
  bool value = digitalRead(titresim);
  if (value) {
Firebase.setBool("depremState", true);
     player.play(5); 
     delay(5000);
     player.reset(); 
  } else {
Firebase.setBool("depremState", false);
  }  
  }


void gazk() {
  bool value = digitalRead(gaz_deger);
  if (!value) {
     motor.write(180);
     motor2.write(180);
Firebase.setBool("GazState", true);
     player.play(6); 
     delay(5000);
     player.reset(); 
  } else {
Firebase.setBool("GazState", false);
  }  
  }
void PIRsensor() {
  bool value = digitalRead(PIR);
  if (value) {

   motor.write(0);
  motor2.write(0);
Firebase.setBool("hirsizState", true);
     player.play(7); 
     delay(5000);
     player.reset(); 
  } else {
Firebase.setBool("hirsizState", false);
    
  }  
  }
void hirsizAlarm()
{
  int hirsizState = Firebase.getInt("hirsizAlarm");
  if (hirsizState == 1)
    {
      PIRsensor();
      }

     else
     {
      Firebase.setBool("hirsizState", false);
     }
}

void setup() {
  // put your setup code here, to run once:
 Serial.begin(115200); // Seri haberleşme başlatılıyor
  softwareSerial.begin(9600);

 if (player.begin(softwareSerial)) {
   Serial.println("OK");

    // Ses seviyesini belirliyoruz (0 to 30).
    player.volume(15);
    // sd karttaki ilk müziği oynatıyoruz.

  } else {
    // dfplayer ile bağlantının kurulamadığını yazdırıyoruz.
    Serial.println("Connecting to DFPlayer Mini failed!");

  }
    pinMode(PIR, INPUT);
    pinMode(titresim, INPUT);
    pinMode(A0, INPUT);
    pinMode(LED_PIN, OUTPUT);
    pinMode(klima_Pin,OUTPUT); 
    
    motor.attach(12);
    motor2.attach(13);
    motor.write(0);
    motor2.write(0);
    digitalWrite(LED_PIN, 0); // LED durumunu ayarlama
    digitalWrite(klima_Pin, 0); // LED durumunu ayarlama

  // WiFi bağlantısı kurulumu
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi bağlandı");

  // Firebase bağlantısı kurulumu
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

  // Sensör ve cihazların başlatılması
  dht.begin();
  player.volume(valume_degeri);
}


unsigned long previousMillisDeprem = 0;
unsigned long previousMillisSicaklikNem = 0;
unsigned long previousMillisGaz = 0;
const long intervalSicaklikNem = 2000; // 2 saniyede bir kontrol
const long intervalGaz = 2500; // 2.5 saniyede bir kontrol
const long intervalDeprem = 100; // 0.1 saniyede bir kontrol

void loop() {
  unsigned long currentMillis = millis();
  
  // Deprem kontrolü
  if (currentMillis - previousMillisDeprem >= intervalDeprem) {
    previousMillisDeprem = currentMillis;
    deprem();
    hirsizAlarm();
  }
  
  // Sıcaklık ve Nem kontrolü
  if (currentMillis - previousMillisSicaklikNem >= intervalSicaklikNem) {
    previousMillisSicaklikNem = currentMillis;
    sicaklikNem();
  }
  
  // Gaz kontrolü
  if (currentMillis - previousMillisGaz >= intervalGaz) {
    previousMillisGaz = currentMillis;
    gazk();
  }
  
  // Diğer sürekli kontrol edilmesi gereken işlevler
  otoKlima();
  isikDegeri();
  aydninlatma();
  klima();
  parkKapisi();
  AnaKapi();
  dfPlay();
  // Not: Bu işlevler, eğer sürekli kontrol edilmesi gerekiyorsa bu şekilde bırakılabilir.
  // Ancak, belirli bir duruma bağlı olarak çalıştırılması gerekiyorsa, uygun koşullar altında çağrılmalıdır.
}

