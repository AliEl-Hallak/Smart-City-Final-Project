#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

// Firebase projenizin bilgileri.
#define FIREBASE_HOST "hellofirebase-16ac9-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "ZnMfZs52vDqDpl5up5EfpMptXZMr0ll2TgeJt3Q5"
char ssid[] = "Ali";
char pass[] = "22224444";

#include <LiquidCrystal_I2C.h>
#include <Servo.h>
#include <Wire.h>

// Servo motorlar ve LCD ekran için pin tanımlamaları
Servo myservo1;  // Giriş kapısı için servo motor
LiquidCrystal_I2C lcd(0x27,16,2); // LCD ekran

// Sensörler için pin tanımlamaları
int parking1_slot1_ir_s = D0;
int parking1_slot2_ir_s = D6;
int parking1_slot3_ir_s = D7;
int parking2_slot1_ir_s = D3;
int parking2_slot2_ir_s = D4;
int parking2_slot3_ir_s = D5;
int entrance_gate = 1; // Giriş kapısı sensörü için pin tanımı güncellendi
int exit_gate = 3; // Çıkış kapısı sensörü için pin tanımı güncellendi

int sayac = 0;

void setup() {
  Serial.begin(115200);
  // WiFi ve Firebase bağlantısı
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

  // LCD ve Servo başlatma
  lcd.init();
  lcd.backlight();
  myservo1.attach(D8);  // Servo motor pin bağlantısı
  myservo1.write(90);  // Başlangıç pozisyonu

  // Sensörler için pin modları
  pinMode(parking1_slot1_ir_s, INPUT);
  pinMode(parking1_slot2_ir_s, INPUT);
  pinMode(parking1_slot3_ir_s, INPUT);
  pinMode(parking2_slot1_ir_s, INPUT);
  pinMode(parking2_slot2_ir_s, INPUT);
  pinMode(parking2_slot3_ir_s, INPUT);
  pinMode(entrance_gate, INPUT);
  pinMode(exit_gate, INPUT);

  lcd.setCursor(2,0);
  lcd.print("SMART PARKING");
}


void loop() {
  
    p1slot1();
    p1slot2();
    p1slot3();
    p2slot1();
    p2slot2();
    p2slot3();
    gates();
    arabasayisi();
 
}


void p1slot1() // parkng 1 slot1
{
  if( digitalRead(parking1_slot1_ir_s) ==HIGH ) 
  {
Firebase.setBool("parking/slot1", false);

   lcd.setCursor(5,1);
  lcd.print("1");
  } 
if( digitalRead(parking1_slot1_ir_s) == LOW)
{
 

Firebase.setBool("parking/slot1", true);


      lcd.setCursor(5,1);
  lcd.print("F");
}

}
   

void p1slot2() // parking 1 slot2
{
  if( digitalRead(parking1_slot2_ir_s) ==HIGH ) 
  {
Firebase.setBool("parking/slot2", false);


     lcd.setCursor(7,1);
  lcd.print("2");
  }
if( digitalRead(parking1_slot2_ir_s) ==LOW )  
  {
 

Firebase.setBool("parking/slot2", true);

      lcd.setCursor(7,1);
  lcd.print("F");
  } 
}


void p1slot3() // parking 1 slot3
{
  if( digitalRead(parking1_slot3_ir_s) == HIGH) 
  {
Firebase.setBool("parking/slot3", false);


      lcd.setCursor(9,1);
  lcd.print("3");
  }
if( digitalRead(parking1_slot3_ir_s) == LOW)  
  {
  

Firebase.setBool("parking/slot3", true);

       lcd.setCursor(9,1);
  lcd.print("F");
  } 
}


// now for parking 2

void p2slot1() // parking 1 slot3
{
   if( digitalRead(parking2_slot1_ir_s) == HIGH) 
  {
Firebase.setBool("parking/slot4", false);


      lcd.setCursor(11,1);
  lcd.print("4");
  }
if( digitalRead(parking2_slot1_ir_s) == LOW)  
  {
     
Firebase.setBool("parking/slot4", true);



      lcd.setCursor(11,1);
  lcd.print("F");
  } 
}


void p2slot2() // parking 1 slot3
{
  if( digitalRead(parking2_slot2_ir_s) == HIGH) 
  {
Firebase.setBool("parking/slot5", false);


    lcd.setCursor(13,1);
  lcd.print("5");
  }
if( digitalRead(parking2_slot2_ir_s) == LOW)  
  {
   
Firebase.setBool("parking/slot5", true);



      lcd.setCursor(13,1);
  lcd.print("F");
  } 
}


void p2slot3() // parking 1 slot3
{
  if( digitalRead(parking2_slot3_ir_s) == HIGH) 
  {
Firebase.setBool("parking/slot6", false);


    lcd.setCursor(15,1);
  lcd.print("6");

  }
if( digitalRead(parking2_slot3_ir_s) == LOW)  
  {
   
Firebase.setBool("parking/slot6", true);


     lcd.setCursor(15,1);
  lcd.print("F");
  } 
}




void arabasayisi() // parking 1 slot3
{
   Firebase.setInt("parkingnum", (6-sayac));

}
// for the gates

void gates()
{

  if (digitalRead(exit_gate) == LOW)
      {
        if (sayac){
          sayac--;
        }
         
          myservo1.write(0);             
         
          delay(1000);
       
          myservo1.write(90);    
          delay(2000);          
         
      }
  
  if (((digitalRead(entrance_gate) == LOW)) && (( digitalRead(parking1_slot1_ir_s) == HIGH) || ( digitalRead(parking1_slot2_ir_s) == HIGH) || ( digitalRead(parking1_slot3_ir_s) == HIGH)  || ( digitalRead(parking2_slot1_ir_s) == HIGH) || ( digitalRead(parking2_slot2_ir_s) == HIGH) || ( digitalRead(parking2_slot3_ir_s) == HIGH)))
      {
                sayac ++;

        myservo1.write(0);             
         
          delay(1000);
       
          myservo1.write(90);              
                   delay(2000);          

      }
     lcd.setCursor(0,1);
  lcd.print("E");
    lcd.print(6-sayac);

}




