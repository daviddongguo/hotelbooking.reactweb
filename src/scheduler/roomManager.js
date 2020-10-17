import axios from 'axios';
import {config} from './common';

export async function getAllRooms() {
	const urlStr = config.server + '/api/rooms';
	const result = await axios.get(urlStr, config);
	return result;
}
