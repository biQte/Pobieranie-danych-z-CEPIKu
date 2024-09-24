import axios, { AxiosError } from 'axios';
import 'dotenv/config';
import Car from '../classes/car';
import Logger from '../utils/logger';
import moment from 'moment';

const { API_URL } = process.env;
const step = 500;
let page = 1;
const yearStep = 2;
let initialCount = 0;
let currentCount = 0;
const MAX_RETRIES = 3;
// const ignoredCarTypes = [
//     'AUTOBUS',
//     'CIĄGNIK ROLNICZY',
//     'CIĄGNIK SAMOCHODOWY',
//     'MOTOCYKL',
//     'MOTOROWER',
//     'NACZ. SPECJALIZOWANA',
//     'NACZEPA CIĘŻAROWA',
//     'NACZEPA SPECJALIZOWANA',
//     'NACZEPA SPECJALNA',
//     'NACZEPA UNIWERSALNA',
//     'PRZYCZ.R.SPECJALIZOW.',
//     'PRZYCZ.R.UNIWERSALNA',
//     'PRZYCZ.ROLN.SPECJALNA',
//     'PRZYCZ.SPECJALIZOWANA',
//     'PRZYCZEPA CIĘŻAROWA',
//     'PRZYCZEPA CIĘŻAROWA ROLNICZA',
//     'PRZYCZEPA LEKKA',
//     'PRZYCZEPA ROLNICZ.SPECJALIZOW.',
//     'PRZYCZEPA ROLNICZA UNIWERSALNA',
//     'PRZYCZEPA SPECJALIZOWANA',
//     'PRZYCZEPA SPECJALNA',
//     'PRZYCZEPA UNIWERSALNA',
//     'SAMOCHODOWY INNY',
// ];

const carTypes = [
    'SAMOCHÓD OSOBOWY',
    'SAM.CIĘŻ. UNIWERSALNY',
    'SAM.CIĘŻ.SPECJALIZOW.',
    'SAM.CIĘŻAROOWY UNIWERSALNY',
    'SAMOCHÓD CIĘŻAROWY',
    'SAMOCHÓD CIĘŻAROWY UNIWERSALNY',
    'SAMOCHÓD SANITARNY',
    'SAMOCHÓD SPECJALNY',
];

export default class CarController {
    static async getAllCarsForVoivodeShip(voivodeshipCode: number | string) {
        try {
            Logger.log(
                `INFO: Start downloading all cars from voivodeship of code: ${voivodeshipCode}`,
            );

            console.log('called');

            let startDateString = '20000101';
            let endDateString = '20020101';

            let startDate = moment(startDateString).format('YYYYMMDD');
            let endDate = moment(endDateString).format('YYYYMMDD');

            let carsResponse;

            const carsData: Record<string, any> = {};

            while (moment(startDate) < moment()) {
                do {
                    let retryCount = 0;
                    let success = false;

                    while (retryCount < MAX_RETRIES && !success) {
                        try {
                            carsResponse = await axios.get(
                                `${API_URL}/pojazdy?wojewodztwo=${voivodeshipCode}&data-od=${startDate}&data-do=${endDate}&typ-daty=1&tylko-zarejestrowane=true&pokaz-wszystkie-pola=false&fields=marka&fields=model&fields=sposob-produkcji&fields=rok-produkcji&fields=rodzaj-pojazdu&fields=podrodzaj-pojazdu&fields=rodzaj-paliwa&limit=${step}&page=${page}`,
                                {
                                    headers: {
                                        accept: 'application/json',
                                    },
                                },
                            );

                            if (!carsResponse.data['data']) {
                                throw new Error(
                                    'Incomplete response: data is undefined.',
                                );
                            }

                            success = true;

                            if (initialCount === 0) {
                                initialCount =
                                    carsResponse.data['meta']['count'];
                            }

                            currentCount += step;

                            for (const car of carsResponse.data['data']) {
                                const inside = car['attributes'];

                                if (
                                    !carTypes.includes(inside['rodzaj-pojazdu'])
                                ) {
                                    continue;
                                }

                                const key = `${inside['marka']}-${
                                    inside['model']
                                }-${
                                    inside['rok-produkcji'] ||
                                    inside['sposob-produkcji']
                                }`;

                                if (carsData[key]) {
                                    carsData[key].count += 1;
                                } else {
                                    carsData[key] = {
                                        brand: inside['marka'],
                                        model: inside['model'],
                                        yearManufactured:
                                            inside['rok-produkcji'] !== null &&
                                            inside['rok-produkcji'] !==
                                                'FABRYCZNY'
                                                ? inside['rok-produkcji']
                                                : inside['sposob-produkcji'],
                                        carType: inside['rodzaj-pojazdu'],
                                        fuelType: inside['rodzaj-paliwa'],
                                        carSubType: inside['podrodzaj-pojazdu'],
                                        count: 1,
                                    };
                                }
                            }

                            console.log('Initial count: ', initialCount);
                            console.log('Current count: ', currentCount);
                            console.log('Page: ', page);
                            console.log(
                                'Date range',
                                startDate,
                                ' - ',
                                endDate,
                            );
                        } catch (e) {
                            retryCount++;
                            if (e instanceof AxiosError) {
                                Logger.log(
                                    `ERROR: ${e.code}, ${e.name}, ${e.stack}, ${e.cause}, ${e.response}, ${e.message}`,
                                );
                            } else {
                                Logger.log(
                                    `ERROR: Failed attempt ${retryCount} for page ${page}: ${e.message}`,
                                );
                            }
                        }
                    }

                    if (!success) {
                        Logger.log(
                            `ERROR: Max retries reached for page ${page}. Skipping page.`,
                        );
                    }

                    carsResponse = null;
                    page++;
                } while (currentCount < initialCount);

                startDate = moment(startDate)
                    .add(yearStep, 'years')
                    .format('YYYYMMDD');
                endDate = moment(endDate)
                    .add(yearStep, 'years')
                    .format('YYYYMMDD');

                currentCount = 0;
                initialCount = 0;
                page = 1;
            }

            Logger.log(
                `INFO: Fetched all cars from voivodeship of code: ${voivodeshipCode}`,
            );

            return carsData;
        } catch (e) {
            if (e instanceof AxiosError) {
                Logger.log(
                    `ERROR: ${e.code}, ${e.name}, ${e.stack}, ${e.cause}, ${e.response}, ${e.message}`,
                );
            } else {
                Logger.log(`ERROR: ${e.message}`);
            }
        }
    }
}
