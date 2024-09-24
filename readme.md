# Aplikacja do pobierania danych na temat zarejestrowanych samochodów w bazie dancyh CEPIK

> [!NOTE]
> Aplikacja do działania wymaga zainstalowanego środowiska node w wersji: v20.11 oraz npm w wersji: 10.8. Do łatwego zarządzania instalacjami wersji node oraz npm polecam [NVM](https://github.com/nvm-sh/nvm)

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

> [!CAUTION]
> Z racji na limity narzucane przez API CEPIK aplikacja działa długo i zajmuje znaczącą ilość pamięci RAM. Minimalna pamięć zainstalowana w komputerze nie powinna być mniejsza niż 4GB.

## Logowanie działania oraz wyjście danych

1. W trakcie działania aplikacja na bieżąco informuje o postępach, logi znajdują się w folderze ./dist/src/log w pliku z datą kiedy program pracował.

> [!TIP]
> Rozróżniane są dwa typy logów: INFO - informacje z przebiegu działania aplikacji oraz ERROR - błędy napotkane w trakcie działania aplikacji

2. Po zakończeniu działania przez aplikację, pobrane dane zapiszą się w pliku ./dist/src/cars.csv który można później zaimportować do aplikacji Excel lub innej preferowanej przez użytkownika

> [!IMPORTANT]
> Proszę o zgłaszanie wszelkich błędów lub sugestii
