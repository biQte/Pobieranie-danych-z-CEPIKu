# Aplikacja do pobierania danych na temat zarejestrowanych samochodów w bazie dancyh CEPIK

## Aby odpalić aplikację nalezy:

1. Sklonować kod z repozytorium [GitHub](https://github.com/biQte/Pobieranie-danych-z-CEPIKu)

```bash
git clone https://github.com/biQte/Pobieranie-danych-z-CEPIKu
```

2. Zainstalować moduły i zależności

```bash
npm install
```

3. Zbudować i zminifikować projekt

```bash
npm run build
```

4. Włączyć aplikację

```bash
node ./dist/src/app.js
```

> [!Ważne]
> Aplikacja działa długo i zajmuje znaczącą ilość pamięci RAM. Minimalna pamięć zainstalowana w komputerze nie powinna być mniejsza niż 8GB.

## Logowanie działania oraz wyjście danych

1. W trakcie działania aplikacja na bieżąco informuje o postępach, logi znajdują się w folderze ./dist/src/log w pliku z datą kiedy program pracował.

> [!Logowanie]
> Rozróżniane są dwa typy logów: INFO - informacje z przebiegu działania aplikacji oraz ERROR - błędy napotkane w trakcie działania aplikacji

2. Po zakończeniu działania przez aplikację, pobrane dane zapiszą się w pliku ./dist/src/cars.csv który można później zaimportować do aplikacji Excel lub innej preferowanej przez użytkownika

### Proszę o zgłaszanie wszelkich błędów lub sugestii
