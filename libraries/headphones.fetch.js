import fetch from 'node-fetch';
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

// GETTING all API headphoness
export const GET_headphoness = (url, token) =>
	fetch(BACKEND_API + url, { headers: { auth: token } }).then((res) =>
		res.json()
	);

// GETTING a API headphones
export const GET_headphones = (url, token) =>
	fetch(BACKEND_API + url, { headers: { auth: token } }).then((res) =>
		res.json()
	);

// CREATING a API headphones
export const POST_headphones = (url, data) =>
	fetch(BACKEND_API + url, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((res) => res.json());

// UPDATING a API headphones
export const PUT_headphones = (url, data, token) =>
	fetch(BACKEND_API + url, {
		method: 'PUT',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			auth: token,
		},
	}).then((res) => res.json());

// DELETING a API headphones
export const DEL_headphones = (url, token) =>
	fetch(BACKEND_API + url, {
		method: 'DELETE',
		headers: { auth: token },
	}).then((res) => res.json());

