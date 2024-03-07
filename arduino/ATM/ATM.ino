#include <EEPROM.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Keypad.h>
#include <SPI.h>
#include <RFID.h>
#include <Wire.h> 
#include <Servo.h>
#define buzzer A0

#define servopin 6
struct AccountInfo {
  int pin;
  int balance;
  int id;
};
Servo motor;
AccountInfo account;
RFID rfid(10,9);

byte kart[5] = {66,53,205,75,241};
const int pinAddress = 0;
const int balanceAddress = sizeof(account.pin);

// Initialize the I2C LCD
LiquidCrystal_I2C lcd(0x27, 20, 4);

// Define the keymap of the keypad
const byte rows = 4; // Four rows
const byte cols = 4; // Four columns

// Define the Keymap
char keys[rows][cols] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};

// Connect keypad ROW0, ROW1, ROW2 and ROW3 to these Arduino pins.
byte rowPins[rows] = {1, 0, 7, 8};

// Connect keypad COL0, COL1, COL2 and COL3 to these Arduino pins.
byte colPins[cols] = {5, 4, 3, 2};

// Initialize the keypad
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, rows, cols);

void setup() {
  pinMode(buzzer,OUTPUT);
  motor.attach(servopin);
 motor.write(0);
  lcd.init(); // initialize the lcd
  lcd.backlight();
  lcd.print("ARDUINO AKILLI ATM!");
  delay(2000);
  // Load account information from EEPROM
 
  EEPROM.get(pinAddress, account.pin);
  EEPROM.get(balanceAddress, account.balance);
  account.id = 12345;
  SPI.begin();
  rfid.init();
}

void loop() {
  
  // Rest of your code with modified input (keypad) and output (LCD) handling
 if(login()){
  
        showMenu();

  
  }}

// All functions like login(), showMenu(), checkBalance(), depositMoney(), withdrawMoney(), changePIN()
// need to be modified to use the keypad for input and the LCD for output.
bool idlogin(){
     
    }

bool login() {
  char enteredPin[5]; // to store the PIN code
  char enteredId[7];  // to store the ID, assuming it's a 6-digit number
  int loginTry = 3;
  bool idMatched = false;
lcd.clear();
  lcd.print("Kartinizi girin: ");
  delay(2000);
  if(rfid.isCard())
  {
 
      if(rfid.readCardSerial())
    {

      Serial.print("Kart bulundu ID: ");
      Serial.print(rfid.serNum[0]);
      Serial.print(",");
      Serial.print(rfid.serNum[1]);
      Serial.print(",");
      Serial.print(rfid.serNum[2]);
      Serial.print(",");
      Serial.print(rfid.serNum[3]);
      Serial.print(",");
      Serial.println(rfid.serNum[4]);
    }
 
  
  for(int i=0; i<5; i++) {
      if(rfid.serNum[i] != kart[i]) {
        
        idMatched = false;
       
      }  
      else 
       idMatched = true;
     

       
    }


if(idMatched){
     lcd.clear();
    lcd.print("Kartiniz kontrol ediliyor..");
         delay(2000);
          lcd.clear();
    lcd.print("Kart basarili");
  digitalWrite(buzzer,1);
        delay(50);
    digitalWrite(buzzer,0);
        delay(50);
        digitalWrite(buzzer,1);
        delay(50);
    digitalWrite(buzzer,0);
    delay(2000);
}

  else
{
     lcd.clear();
    lcd.print("Kartiniz kontrol ediliyor..");
         delay(2000);
        lcd.clear();
    lcd.print("Yanlis kart.");
         digitalWrite(buzzer,1);
        delay(1000);
        digitalWrite(buzzer,0);
}

 }

    
  
  


 while(idMatched){



  int index = 0; // reset index for the PIN code
  lcd.clear();
  lcd.print("PIN'inizi girin: ");

  while (loginTry > 0 && idMatched) {
    loginTry--;
    char key = keypad.getKey();
    while (key == NO_KEY || index < 4) { // assuming a 4-digit PIN
      key = keypad.getKey();
        delay(50);
      if (key != NO_KEY && key != '#') {
        enteredPin[index] = key; // append the key to the PIN string
        index++;
        lcd.setCursor(index, 1); // move cursor to the right
        lcd.print("*"); // print a star for each digit
        digitalWrite(buzzer,1);
        delay(50);
    digitalWrite(buzzer,0);
      }
      if (key == '#') { // '#' is used to signal end of input
        enteredPin[index] = '\0'; // terminate the PIN string
        break;
      }
    }

    if (atoi(enteredPin) == account.pin) {
      lcd.clear();
  lcd.print("Giris Basarli");

       digitalWrite(buzzer,1);
        delay(50);
    digitalWrite(buzzer,0);
        delay(50);
        digitalWrite(buzzer,1);
        delay(50);
    digitalWrite(buzzer,0);

      delay(2000);
      return true; // Successful login
    } else {
      lcd.clear();
  lcd.print("Yanlis PIN.");
       digitalWrite(buzzer,1);
        delay(1000);
        digitalWrite(buzzer,0);
      lcd.clear();
      if (loginTry > 0) {
        lcd.print("Bir daha deneyin.");
          delay(1000);
         lcd.clear();
  lcd.print("PIN'inizi girin: ");
        index = 0; // reset index for next PIN entry
      }
    }
  }

  if (loginTry <= 0) {
    lcd.clear();
  lcd.print("Kart bloke edildi.");
  lcd.print("Bankayi arayin.");
    digitalWrite(buzzer,1);
    delay(2000);
    digitalWrite(buzzer,0);
    motor.write(180);
    delay(1000);
    motor.write(0);


        return 0;
  }

 }

  

  return false; // Failed login
 
}





void showMenu() {
  char key = 0; // Variable to store the pressed key

  while (true) {
    // Display the menu
    lcd.clear();
    lcd.setCursor(0, 0);
  lcd.print("A.Bakiye Sorgulama");
    lcd.setCursor(0, 1);
  lcd.print("B.Para Yatirma");
    lcd.setCursor(0, 2);
  lcd.print("C.Para cekme");
    lcd.setCursor(0, 3);
  lcd.print("D.PIN Degistirme");
  

    // Wait for key press
    key = keypad.waitForKey();
 if (key != NO_KEY && key != '#') {
        digitalWrite(buzzer,1);
        delay(50);
    digitalWrite(buzzer,0);
      }

    // Act upon the pressed key
    switch (key) {
      case 'A': // Check balance
        checkBalance();
        break;
      case 'B': // Deposit money
        depositMoney();
        break;
      case 'C': // Withdraw money
        withdrawMoney();
        break;
      case 'D': // Change PIN
        changePIN();
        break;
      case '*': // Exit the menu
        lcd.clear();
        lcd.setCursor(0, 0);
  lcd.print("cikis yapiliyor...");
        lcd.setCursor(0, 2);
  lcd.print("Arduino ATM'yi kullandiginiz icin tesekkurler!");
        lcd.setCursor(0, 3);
        lcd.print("Arduino ATM!");
        delay(2000);
        return; // Return from the function, which should exit the menu
      default: // Handle invalid key press
        lcd.clear();
  lcd.print("Gecersiz Secenek");
        delay(2000);
        break; // Will cause the menu to be shown again
    }

    // Add a small delay to prevent bouncing/erroneous multiple reads
    delay(100);
  }
}



void checkBalance() {
  lcd.clear();
  lcd.print("Bakiye: $");
  lcd.print(account.balance);
  delay(3000); // Display balance for 3 seconds before clearing the screen
}
void depositMoney() {
  lcd.clear();
  lcd.print("Yatirilacak Miktar: $");
  
  char key;
  char amount[10];
  int index = 0;
  
  while (true) {
    key = keypad.getKey();
    if (key != NO_KEY) {
      if (key == '#') { // '#' to end input
        amount[index] = '\0'; // Null-terminate the string
         digitalWrite(buzzer,1);
        delay(50);
        digitalWrite(buzzer,0);
        delay(50);
        digitalWrite(buzzer,1);
        delay(50);
        digitalWrite(buzzer,0);
        break;
      } else if (key >= '0' && key <= '9') {
        amount[index++] = key; // Add digit to amount
        lcd.print(key);
          digitalWrite(buzzer,1);
        delay(50);
        digitalWrite(buzzer,0);
      }
    }
  }
  
  account.balance += atoi(amount);
  EEPROM.put(balanceAddress, account.balance);
  
  lcd.clear();
  lcd.print("Yeni Bakiye: $");
  lcd.print(account.balance);
  delay(3000); // Display new balance for 3 seconds
}
void withdrawMoney() {
  lcd.clear();
  lcd.print("Cekilecek Miktar: $");
  
  char key;
  char amount[10];
  int index = 0;
  
  while (true) {
    key = keypad.getKey();
    if (key != NO_KEY) {
      if (key == '#') { // '#' to end input
        amount[index] = '\0'; // Null-terminate the string
     
        break;
      } else if (key >= '0' && key <= '9') {
        amount[index++] = key; // Add digit to amount
        lcd.print(key);
          digitalWrite(buzzer,1);
        delay(50);
        digitalWrite(buzzer,0);
      }
    }
  }
  
  int withdrawal = atoi(amount);
  if (withdrawal <= account.balance) {
    account.balance -= withdrawal;
    EEPROM.put(balanceAddress, account.balance);
    lcd.clear();
  lcd.print("cekilen: $");
    lcd.print(withdrawal);


       digitalWrite(buzzer,1);
        delay(50);
        digitalWrite(buzzer,0);
        delay(50);
        digitalWrite(buzzer,1);
        delay(50);
        digitalWrite(buzzer,0);
    lcd.setCursor(0, 1);
  lcd.print("Yeni Bakiye: $");
    lcd.print(account.balance);
    
  } else {
    lcd.clear();
  lcd.print("Yetersiz bakiye");
    digitalWrite(buzzer,1);
    delay(1000);
    digitalWrite(buzzer,0);
  }
  delay(3000); // Allow user time to read message
}
void changePIN() {
  lcd.clear();
  lcd.print("Yeni PiN: ");
  
  char key;
  char newPin[5];
  int index = 0;
  
  while (true) {
    key = keypad.getKey();
    if (key != NO_KEY) {
      if (key == '#') { // '#' to end input
        newPin[index] = '\0'; // Null-terminate the string
              digitalWrite(buzzer,1);
        delay(50);
        digitalWrite(buzzer,0);
        delay(50);
        digitalWrite(buzzer,1);
        delay(50);
        digitalWrite(buzzer,0);
        break;
      } else if (key >= '0' && key <= '9' && index < 4) { // 4-digit PIN
        newPin[index++] = key; // Add digit to newPin
        lcd.print("*"); // Print * to hide PIN
          digitalWrite(buzzer,1);
        delay(50);
        digitalWrite(buzzer,0);
      }
    }
  }
  
  account.pin = atoi(newPin);
  EEPROM.put(pinAddress, account.pin);
  lcd.clear();
  lcd.print("PIN Degistirildi");
  delay(3000); // Display message for 3 seconds
}
