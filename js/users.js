// Global variables
const usersUrl = 'https://randomuser.me/api/?results=12';
const overlay = document.querySelector('.overlay');
const overlayData = document.querySelector('.overlay-data');
const employees = document.querySelector('.employee-container');
const randomUsers = [];

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

// Generate HTML functions
function generateUserCards(users) {
	users.forEach((user, idx) => {
		randomUsers.push(user);
		const { picture, name, email, location } = user;
		const fullName = `${name.first} ${name.last}`;

		// Create employee div
		const card = createElement('div', 'card');
		card.id = idx;

		// Create elements that make up each employee card
		const img = createElement('img', 'profile-img');
		img.src = picture.medium;
		img.alt = `Picture of ${fullName}`;
		const textDiv = createElement('div', 'employee-text');
		const nameH3 = createElement('h3', 'name', `${fullName}`);
		const emailP = createElement('p', 'email', email);
		const locationP = createElement('p', 'location', location.city);

		// Create array of elements to append to div
		const textItems = [nameH3, emailP, locationP];
		appendItems(textDiv, textItems);

		const childItems = [img, textDiv];
		appendItems(card, childItems);

		appendItems(employees, [card]);
	});
	console.log(randomUsers);
}

function generateOverlay(user) {
	overlay.style.display = 'block';
	overlayData.style.display = 'flex';

	const closeBtn = createElement('button', 'close-overlay', 'Close');
	const dataElements = [closeBtn];
	appendItems(overlayData, dataElements);
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

function handleCardClick(evt) {
	let currNode = evt.target;
	while (currNode.className !== 'card') {
		currNode = currNode.parentNode;
	}
	generateOverlay(randomUsers[currNode.id]);
}

function closeOverlay(evt) {
	const { target } = evt;
	if (target.tagName === 'BUTTON' || target.className === 'overlay') {
		overlayData.innerHTML = '';
		overlayData.style.display = 'none';
		overlay.style.display = 'none';
	}
}

function removeChildren(parentNode) {
	console.log(parentNode);
	while (parentNode.firstChild) {
		console.log(parentNode.firstElementChild);
		parentNode.removeChild(parent.firstElementChild);
	}
}

// Event Listener
document.addEventListener('DOMContentLoaded', () => getRandomUsers(usersUrl));
employees.addEventListener('click', handleCardClick);
overlay.addEventListener('click', closeOverlay);
