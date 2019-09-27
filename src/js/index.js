import style from "../css/style.scss";
import api from "./modules/api"
import slugify from 'slugify'


if (process.env.NODE_ENV === 'development') {
	console.log('Working in development mode');
}

const $ = document.querySelector.bind(document),
	$$ = document.querySelectorAll.bind(document),
	listWrap = $('.js-list-wrap'),
	search = $('.js-search'),
	loader = $('.js-loader'),
	btnMore = $('.js-btn');

let timerId = null,
	flag = false;

// по идеи данные для апи, чтобы получать фильмы по порядку
let limit = 10,
	pages = 0;

function getAllFilms(params) {
	if (!flag) {
		loader.classList.remove('hide');
		flag = true;
		api.getAllFilms('films', params).then((data) => {
			renderList(data.results);
			flag = false;
			loader.classList.add('hide');
		}).catch((err) => {
			flag = false;
			loader.classList.add('hide');
			console.log(err);
		});
	}
}

//первоначальная загрузка
window.onload = () => {
	getAllFilms(null);
};

btnMore.addEventListener('click', () => {
	// параметры для отправки
	let params = {
		limit,
		pages
	};
	getAllFilms(params);

	pages += limit;
});


//получение изображений
function getImage(name) {
	let slug = addSlug(name),
		defaultImg = 'http://placehold.it/260x85?text=Placeholder';

	return api.getImages(slug).then((data) => {
		if (data.hits.length === 0) {
			return defaultImg;
		} else {
			return data.hits[0].webformatURL
		}
	});
}

function addSlug(name) {
	return slugify(name, {
		replacement: '-',
		remove: /[$*_+~.()'"!\-:@]/g,
		lower: true
	})
}

function addTemplate(img, title, director) {
	return `<li class="films__item js-film"><div class="films__img"><img src="${img}" alt=""></div><div class="films__body"><span class="films__title js-title">${title}</span><span class="films__name">${director}</span></div></li>`;

}

function renderList(films) {
	renderList
	let arr = [];
	for (let i in films) {
		// получаем массив промисов с карточками + изображения
		arr.push(
			getImage(films[i].title).then((img) => addTemplate(img, films[i].title, films[i].director))
		)
	}
	//добавляем темплайт
	Promise.all(arr).then((template) => {
		listWrap.insertAdjacentHTML('beforeEnd', template.join().replace(/,/g, ''));
	});

	//сбрасываем поиск
	search.value = '';
	doneTyping();
}

search.addEventListener('keyup', (e) => {
	let interval = 1000;
	clearTimeout(timerId);

	// обработка ввода срабатывает после того как перестал набирать 1секунда
	timerId = setTimeout(doneTyping, interval);

});

function doneTyping() {
	let films = $$('.js-film'),
		filter = search.value.trim().toLowerCase();

	for (let film of films) {
		let title = film.querySelector('.js-title');

		if (title.innerHTML.toLowerCase().indexOf(filter) > -1) {
			film.classList.remove('hide');
		} else {
			film.classList.add('hide');
		}
	}

	/*
	не нашел метода в апи по поиску фильмов по имени + их там всего 7 =)
	предположительно где то тут отправлял запрос
	api.getFilmNamed(filter).then((data) => { что то тут ..})
	*/
}