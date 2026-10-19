# Mera Pasta
Detta är ett projektarbete i kursen DT207G Backend-baserad webbvuteckling. Projektet går ut på att skapa en webbapplikation till en fiktiv restaurang. Applikationen konsumerar ett REST-API för att hämta, skapa, uppdatera och radera data som lagras i en databas. Användarna kan logga in på ett dashboard för att hantera och redigera innehållet. Webbapplikationen är utvecklad med ramverket Angular och stylad med SCSS.

## URL till webbapplikation
https://project-merapasta.netlify.app/

## Teknik
* Angular
* TypeScript
* SCSS
* CRUD-operationer
* Dymnamiska sidor och menyer
* Inloggning med olika roller
* Interface, services och guards


## Funktioner för besökare
* Se restaurangens menyer och öppettider
* Boka bord via formulär.
* Läsa om restaurangen.

## Funktioner för personal
* Lägga till, ändra och radera mennyartiklar och öppettider.
* Redigera och radera inkomna bokningsförfrågningar. 

## Funktioner för admin
* Skapa, uppdatera och radera menykategoierna (ex. varmrätt, pastasallader, dryck).
* Se alla användarkonton, skapa nya användare och radera användare
* Kan även utföra samma funktioner som personalen.

## Felmeddelande och säkerhet
* Vid fel visas ett meddelanden för besökare, personal och admin.  
* Formulär valideras innan data skickas till backend. 
* Vid inloggning verifieras kontot. Om kontot finns och användaruppgifterna stämmer returneras en token. Denna token skickas sedan med till skyddade routes i CRUD-operationerna.
* Guards används för att kontrollera om användaren är inloggad samt vilken roll som användaren har. Menyer och innehåll varierar beroende på användarens roll.
