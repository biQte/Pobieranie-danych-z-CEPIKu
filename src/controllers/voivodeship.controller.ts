import axios, { AxiosError } from 'axios';
import 'dotenv/config';
import Logger from '../utils/logger';
import Voivodeship from '../classes/voivodeship';

const { API_URL } = process.env;

export default class VoivodeshipController {
    static async getVoivodeshipsList() {
        try {
            Logger.log('INFO: Start downloading voivodeships list');

            const voivodeshipsResponse = await axios.get(
                `${API_URL}/slowniki/wojewodztwa`,
                {
                    headers: {
                        accept: 'application/json',
                    },
                },
            );

            if (voivodeshipsResponse.status !== 200) {
                Logger.log('ERROR: While getting voivodeships');
                return;
            }

            const voivodeshipsFromResponse =
                voivodeshipsResponse.data['data']['attributes'][
                    'dostepne-rekordy-slownika'
                ];

            let voivodeships: Voivodeship[] = [];

            for (const voivodeship of voivodeshipsFromResponse) {
                if (voivodeship['klucz-slownika'] == 'XX') continue;
                voivodeships.push(
                    new Voivodeship(
                        voivodeship['klucz-slownika'],
                        voivodeship['wartosc-slownika'],
                    ),
                );
            }

            Logger.log('INFO: Fetched all voivodeships');

            return voivodeships;
        } catch (e) {
            if (e instanceof AxiosError) {
                Logger.log(
                    `ERROR: ${e.code}, ${e.name}, ${e.stack}, ${e.cause}, ${e.response}, ${e.message}`,
                );
            } else {
                Logger.log(`ERROR: ${e.message}`);
            }
            return;
        }
    }
}
