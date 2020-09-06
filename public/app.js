let input = document.querySelector('.input_text');
let main = document.querySelector('#name');
let temp = document.querySelector('.temp');
let addDate = document.querySelector('.date');
let desc = document.querySelector('.desc');
let button = document.querySelector('.submit');
let imgIcon = document.querySelector('#imgIcon');
let errorMsg = document.querySelector('.error-msg');

window.addEventListener('DOMContentLoaded', (e) => {
	const weatherData = JSON.parse(localStorage.getItem('currentSearch'));
	if (weatherData) {
		main.innerHTML = weatherData.name;
		desc.innerHTML = weatherData.desc;
		temp.innerHTML = weatherData.temp;
		addDate.innerHTML = weatherData.date;
		imgIcon.src = `https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;
	}
	registerSw();
});

button.addEventListener('click', (e) => {
	e.preventDefault();
	fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=metric&appid=40a4d68116a7a73852e825785247eab8`
	)
		.then((response) => response.json())
		.then((data) => {
			errorMsg.style.display = 'none';
			let tempValue = `${Math.round(data['main']['temp'])}&deg;`;
			let nameValue = `${data['name']}, <span>${data.sys.country}</span>`;
			let descValue = data['weather'][0]['description'];
			let dateValue = new Date().toDateString();

			main.innerHTML = nameValue;
			desc.innerHTML = descValue;
			temp.innerHTML = tempValue;
			addDate.innerHTML = dateValue;
			imgIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
			input.value = '';

			const weatherResults = {
				name: nameValue,
				temp: tempValue,
				desc: descValue,
				date: dateValue,
				icon: data.weather[0].icon,
			};
			localStorage.setItem('currentSearch', JSON.stringify(weatherResults));
		})

		.catch((err) => {
			errorMsg.style.display = 'flex';
			errorMsg.innerHTML = 'No such City';
		});
});

// service worker
const registerSw = async () => {
	if ('serviceWorker' in navigator) {
		try {
			await navigator.serviceWorker.register('./service-worker.js');
		} catch (e) {
			console.log(`SW registration failed`);
		}
	}
};
