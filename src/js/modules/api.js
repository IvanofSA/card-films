import axios from 'axios';

export default {
	getAllFilms: (endpoint, params) => {
		return axios.get(`https://swapi.co/api/${endpoint}/`, {params})
			.then((response) => response.data)
			.catch(error => console.log(error));
	},

	// getFilmNamed: (name) => {
	// 	return axios.get(`https://swapi.co/api/films/`,{params : {title: name}}).then((response) => {
	// 		return response.data
	// 	}).catch(error => console.log(error));
	// },

	getImages: (name) => {
		let key = '13764023-2d2e77887e3f839921a955faf';
		return axios.get(`https://pixabay.com/api/`, {params: {key, q: name}})
			.then((response) => response.data)
			.catch(error => console.log(error));
	}
}

