import style from "../css/style.scss";

if(process.env.NODE_ENV === 'development') {
	console.log('Working in development mode');
}

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

