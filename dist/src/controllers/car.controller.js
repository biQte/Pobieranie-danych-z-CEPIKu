"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importStar(require("axios"));
require("dotenv/config");
const logger_1 = __importDefault(require("../utils/logger"));
const moment_1 = __importDefault(require("moment"));
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
class CarController {
    static getAllCarsForVoivodeShip(voivodeshipCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.log(`INFO: Start downloading all cars from voivodeship of code: ${voivodeshipCode}`);
                let startDateString = '20000101';
                let endDateString = '20020101';
                let startDate = (0, moment_1.default)(startDateString).format('YYYYMMDD');
                let endDate = (0, moment_1.default)(endDateString).format('YYYYMMDD');
                let carsResponse;
                const carsData = {};
                while ((0, moment_1.default)(startDate) < (0, moment_1.default)()) {
                    do {
                        let retryCount = 0;
                        let success = false;
                        while (retryCount < MAX_RETRIES && !success) {
                            try {
                                carsResponse = yield axios_1.default.get(`${API_URL}/pojazdy?wojewodztwo=${voivodeshipCode}&data-od=${startDate}&data-do=${endDate}&typ-daty=1&tylko-zarejestrowanie=true&pokaz-wszystkie-pola=false&fields=marka&fields=model&fields=sposob-produkcji&fields=rok-produkcji&fields=rodzaj-pojazdu&fields=podrodzaj-pojazdu&fields=rodzaj-paliwa&limit=${step}&page=${page}`, {
                                    headers: {
                                        accept: 'application/json',
                                    },
                                });
                                if (!carsResponse.data['data']) {
                                    throw new Error('Incomplete response: data is undefined.');
                                }
                                success = true;
                                if (initialCount === 0) {
                                    initialCount =
                                        carsResponse.data['meta']['count'];
                                }
                                currentCount += step;
                                for (const car of carsResponse.data['data']) {
                                    const inside = car['attributes'];
                                    if (!carTypes.includes(inside['rodzaj-pojazdu'])) {
                                        continue;
                                    }
                                    const key = `${inside['marka']}-${inside['model']}-${inside['rok-produkcji'] ||
                                        inside['sposob-produkcji']}`;
                                    if (carsData[key]) {
                                        carsData[key].count += 1;
                                    }
                                    else {
                                        carsData[key] = {
                                            brand: inside['marka'],
                                            model: inside['model'],
                                            yearManufactured: inside['rok-produkcji'] !== null &&
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
                                console.log('Date range', startDate, ' - ', endDate);
                            }
                            catch (error) {
                                retryCount++;
                                logger_1.default.log(`ERROR: Failed attempt ${retryCount} for page ${page}: ${error.message}`);
                            }
                        }
                        if (!success) {
                            logger_1.default.log(`ERROR: Max retries reached for page ${page}. Skipping page.`);
                        }
                        carsResponse = null;
                        page++;
                    } while (currentCount < initialCount);
                    startDate = (0, moment_1.default)(startDate)
                        .add(yearStep, 'years')
                        .format('YYYYMMDD');
                    endDate = (0, moment_1.default)(endDate)
                        .add(yearStep, 'years')
                        .format('YYYYMMDD');
                    currentCount = 0;
                    initialCount = 0;
                    page = 1;
                }
                logger_1.default.log(`INFO: Fetched all cars from voivodeship of code: ${voivodeshipCode}`);
                return carsData;
            }
            catch (e) {
                if (e instanceof axios_1.AxiosError) {
                    logger_1.default.log(`ERROR: ${e.code}, ${e.name}, ${e.stack}, ${e.cause}, ${e.response}, ${e.message}`);
                }
                else {
                    logger_1.default.log(`ERROR: ${e.message}`);
                }
            }
        });
    }
}
exports.default = CarController;
