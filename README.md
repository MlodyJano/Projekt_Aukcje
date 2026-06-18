# Alledrogo

Alledrogo to aplikacja webowa do przeprowadzania aukcji internetowych. Użytkownicy mogą wystawiać przedmioty na sprzedaż, przeglądać oferty innych oraz brać udział w licytacjach w czasie rzeczywistym.

## Technologie

Frontend został zbudowany w Angular 17 z wykorzystaniem standalone components. Backend to ASP.NET Core Web API z bazą danych SQLite obsługiwaną przez Entity Framework Core. Komunikacja między frontendem a backendem odbywa się przez REST API z proxy na porcie 5026.

## Funkcjonalności

Aplikacja umożliwia rejestrację i logowanie użytkowników. Po zalogowaniu użytkownik może przeglądać katalog aukcji z możliwością filtrowania po kategorii i statusie oraz wyszukiwania po tytule. Każdy zalogowany użytkownik może wystawić własną aukcję z opisem, ceną wywoławczą, datą zakończenia oraz zdjęciem. Licytowanie jest możliwe na aukcjach innych użytkowników — własnych aukcji licytować nie można. Właściciel aukcji może ją anulować przed zakończeniem. Sekcja "Moje aukcje" pokazuje wszystkie aukcje wystawione przez zalogowanego użytkownika, a "Moje licytacje" pokazuje aukcje w których użytkownik brał udział.

## Uruchomienie

Backend uruchamiamy poleceniem `dotnet run` w folderze `Backend/AuctionSystem.API/AuctionSystem.API`. Frontend uruchamiamy poleceniem `npm start` w folderze `auction-frontend`. Aplikacja dostępna jest pod adresem `http://localhost:4200`.

## Domyślne konto

Po pierwszym uruchomieniu aplikacji tworzony jest domyślny użytkownik z loginem `admin@auction.pl` i hasłem `admin123`.
