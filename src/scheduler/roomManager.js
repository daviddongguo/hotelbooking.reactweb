import axios from 'axios';
import {config} from './common';

export async function getAllRooms() {
	const urlStr = config.server + '/api/rooms';
	const result = await axios.get(urlStr, config);
	return result;
}

export async function addBooking(booking) {
	const urlStr = config.server + 'api/bookings';
	const result = await axios.post(urlStr, booking, config);
	return result;
}

export async function deleteBooking(bookingId) {
	const urlStr = config.server + 'api/bookings/' + bookingId;
	try {
		return await axios.delete(urlStr, config);
	} catch (error) {
		return error;
	}
}

export async function updateBookingDate(bookingId, booking) {
	const urlStr = config.server + 'api/bookings/' + bookingId;
	try {
		return await axios.delete(urlStr, config);
	} catch (error) {
		return error;
	}
}
