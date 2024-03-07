// Trafik ışıkları ve IR sensörleri için pin tanımlamaları
const int trafficLights[4][3] = {{2, 3, 4}, {5, 6, 7}, {8, 9, 10}, {11, 12, 13}};
const int sensors[4] = {A0, A1, A2, A3};

void setup() {
  // Trafik ışıkları ve sensörler için pin modlarını ayarla
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 3; j++) {
      pinMode(trafficLights[i][j], OUTPUT);

     
    }
     digitalWrite(trafficLights[i][3], 1);
    pinMode(sensors[i], INPUT);
  }
}

void loop() {
  for (int i = 0; i < 4; i++) {
    // Trafik ışığını yeşile çevir
    changeLight(i, 2);
    delay(5000); // Yeşil ışık süresi

    // Eğer sensör araç algılarsa, yeşil ışığı uzat
    if (digitalRead(sensors[i]) == 0) {
      delay(9000); // Algılanan araç için ek süre
    }

    // Trafik ışığını sarıya çevir
    changeLight(i, 1);
    delay(2000); // Sarı ışık süresi

    // Trafik ışığını kırmızıya çevir
    changeLight(i, 0);
    delay(2000); // Diğer ışıkların yeşil olması için bekleme süresi
  }
}

void changeLight(int lightIndex, int colorIndex) {
  // Tüm ışıkları kapat
  for (int j = 0; j < 3; j++) {
    digitalWrite(trafficLights[lightIndex][j], LOW);
  }
  // Belirtilen ışığı aç
  digitalWrite(trafficLights[lightIndex][colorIndex], HIGH);
}