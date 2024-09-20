"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voivodeship_controller_1 = __importDefault(require("./controllers/voivodeship.controller"));
const car_controller_1 = __importDefault(require("./controllers/car.controller"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_1 = require("csv");
const logger_1 = __importDefault(require("./utils/logger"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const voivodeships = yield voivodeship_controller_1.default.getVoivodeshipsList();
    if (!voivodeships)
        return;
    const allCarsData = {};
    (function () {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            try {
                for (var _d = true, voivodeships_1 = __asyncValues(voivodeships), voivodeships_1_1; voivodeships_1_1 = yield voivodeships_1.next(), _a = voivodeships_1_1.done, !_a; _d = true) {
                    _c = voivodeships_1_1.value;
                    _d = false;
                    const voivodeship = _c;
                    const carsDataFromVoivodeship = yield car_controller_1.default.getAllCarsForVoivodeShip(voivodeship.key);
                    for (const key in carsDataFromVoivodeship) {
                        if (allCarsData[key]) {
                            allCarsData[key].count +=
                                carsDataFromVoivodeship[key].count;
                        }
                        else {
                            allCarsData[key] = carsDataFromVoivodeship[key];
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = voivodeships_1.return)) yield _b.call(voivodeships_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    })();
    const csvFilePath = path_1.default.join(__dirname, 'csvFile', 'cars.csv');
    const csvHeaders = [
        'Marka',
        'Model',
        'Rok produkcji',
        'Rodzaj pojazdu',
        'Rodzaj paliwa',
        'Podrodzaj pojazdu',
        'Liczba wystąpień',
    ];
    const updatedCsvData = Object.values(allCarsData).map((car) => [
        car.brand,
        car.model,
        car.yearManufactured,
        car.carType,
        car.fuelType,
        car.carSubType,
        car.count,
    ]);
    (0, csv_1.stringify)(updatedCsvData, (err, output) => {
        if (err) {
            logger_1.default.log(`ERROR: ${err.message}`);
        }
        else {
            fs_1.default.writeFileSync(csvFilePath, csvHeaders.join(',') + '\n' + output);
            logger_1.default.log(`INFO: Data written to ${csvFilePath}`);
        }
    });
    console.log('Dane zostały zapisane do pliku CSV.');
});
main();
