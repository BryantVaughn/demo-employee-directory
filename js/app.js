const usersUrl = 'https://randomuser.me/api/?results=12';
const employees = document.querySelector('.employee-container');

// Fetch functions
async function fetchData(url) {
	try {
		const res = await fetch(url);
		return await res.json();
	} catch (err) {
		throw err;
	}
}

async function getRandomUsers(url) {
	const data = await fetchData(url);
	const users = data.results;
	generateUserCards(users);
}

// Generate HTML from JSON
function generateUserCards(users) {
	users.forEach((user) => {
		const { picture, name, email, location } = user;
		const fullName = `${name.first} ${name.last}`;
		// const html = `
		//   <div class="card">
		//     <img src="${picture.thumbnail}" alt="Picture of ${name.first} ${name.last}" />
		//     <h3 class="name">${name.first} ${name.last}</h3>
		//     <p class="email">${email}</p>
		//     <p class="location">${location.city}<p>
		//   </div>
		// `;

		// Create employee div
		const card = createElement('div', 'card');

		// Create elements that make up each employee card
		const img = createElement('img', 'profile-img');
		img.src = picture.thumbnail;
		img.alt = `Picture of ${fullName}`;
		const nameH3 = createElement('h3', 'name', `${fullName}`);
		const emailP = createElement('p', 'email', email);
		const locationP = createElement('p', 'location', location.city);

		// Create array of elements to append to div
		const childItems = [img, nameH3, emailP, locationP];
		appendItems(card, childItems);
		appendItems(employees, [card]);
	});
}

// Helper Functions
function createElement(ele, className = null, textContent = null) {
	const element = document.createElement(ele);
	element.textContent = textContent;
	element.className = className;
	return element;
}

function appendItems(parentNode, itemsToAppend) {
	itemsToAppend.forEach((item) => parentNode.appendChild(item));
}

// Event Listener
document.addEventListener('DOMContentLoaded', () => getRandomUsers(usersUrl));
