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
const voivodeship_1 = __importDefault(require("../classes/voivodeship"));
const { API_URL } = process.env;
class VoivodeshipController {
    static getVoivodeshipsList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.log('INFO: Start downloading voivodeships list');
                const voivodeshipsResponse = yield axios_1.default.get(`${API_URL}/slowniki/wojewodztwa`, {
                    headers: {
                        accept: 'application/json',
                    },
                });
                if (voivodeshipsResponse.status !== 200) {
                    logger_1.default.log('ERROR: While getting voivodeships');
                    return;
                }
                const voivodeshipsFromResponse = voivodeshipsResponse.data['data']['attributes']['dostepne-rekordy-slownika'];
                let voivodeships = [];
                for (const voivodeship of voivodeshipsFromResponse) {
                    if (voivodeship['klucz-slownika'] == 'XX')
                        continue;
                    voivodeships.push(new voivodeship_1.default(voivodeship['klucz-slownika'], voivodeship['wartosc-slownika']));
                }
                logger_1.default.log('INFO: Fetched all voivodeships');
                return voivodeships;
            }
            catch (e) {
                if (e instanceof axios_1.AxiosError) {
                    logger_1.default.log(`ERROR: ${e.code}, ${e.name}, ${e.stack}, ${e.cause}, ${e.response}, ${e.message}`);
                }
                else {
                    logger_1.default.log(`ERROR: ${e.message}`);
                }
                return;
            }
        });
    }
}
exports.default = VoivodeshipController;
