import VoivodeshipController from './controllers/voivodeship.controller';
import CarController from './controllers/car.controller';
import fs from 'fs';
import path from 'path';
import { stringify } from 'csv';
import Logger from './utils/logger';
import moment from 'moment';

const main = async () => {
    const voivodeships = await VoivodeshipController.getVoivodeshipsList();

    if (!voivodeships) return;

    const allCarsData: Record<string, any> = {};

    for (const voivodeship of voivodeships) {
        const carsDataFromVoivodeship =
            await CarController.getAllCarsForVoivodeShip(voivodeship.key);

        for (const key in carsDataFromVoivodeship) {
            if (allCarsData[key]) {
                allCarsData[key].count += carsDataFromVoivodeship[key].count;
            } else {
                allCarsData[key] = carsDataFromVoivodeship[key];
            }
        }
    }

    const csvFileDirectory = path.join(__dirname, 'output');

    if (!fs.existsSync(csvFileDirectory)) {
        fs.mkdirSync(csvFileDirectory, { recursive: true });
    }

    const csvFilePath = path.join(
        csvFileDirectory,
        `cars.csv - ${moment().format('DD-MM-YYYY HH:mm')}`,
    );
    const csvHeaders = [
        'Marka',
        'Model',
        'Rok produkcji',
        'Rodzaj pojazdu',
        'Rodzaj paliwa',
        'Podrodzaj pojazdu',
        'Liczba wystąpień',
    ];

    const updatedCsvData = Object.values(allCarsData).map((car: any) => [
        car.brand,
        car.model,
        car.yearManufactured,
        car.carType,
        car.fuelType,
        car.carSubType,
        car.count,
    ]);

    stringify(updatedCsvData, (err, output) => {
        if (err) {
            Logger.log(`ERROR: ${err.message}`);
        } else {
            fs.writeFileSync(csvFilePath, csvHeaders.join(',') + '\n' + output);
            Logger.log(`INFO: Data written to ${csvFilePath}`);
        }
    });

    console.log('Dane zostały zapisane do pliku CSV.');
};

main();
