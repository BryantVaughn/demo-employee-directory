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
		// Add user to randomUsers array
		randomUsers.push(user);
		// Create employee div with user index
		const card = createElement('div', 'card');
		card.id = idx;
		// Generate data for each card
		generateMainData(card, user, 'medium');
		// Append card to employee container
		appendItems(employees, [card]);
	});
}

function generateMainData(parentElement, user, imgSize) {
	// Create elements that make up each employee card
	const { picture, name, email, location } = user;
	const fullName = `${name.first} ${name.last}`;
	const img = createElement('img', 'profile-img');
	img.src = imgSize === 'medium' ? picture.medium : picture.large;
	img.alt = `Picture of ${fullName}`;
	const textDiv = createElement('div', 'employee-text');
	const nameH3 = createElement('h3', 'name', `${fullName}`);
	const emailP = createElement('p', 'email', email);
	const locationP = createElement('p', 'location', location.city);

	const textData = [nameH3, emailP, locationP];
	appendItems(textDiv, textData);

	const childElements = [img, textDiv];
	appendItems(parentElement, childElements);
}

function generateSubData(parentElement, user) {
	console.log(user);
	const { phone, location, dob } = user;
	const formattedPhone = formatPhoneNumber(phone);
	const streetAddress = streetAddressBuilder(location);
	const formattedDate = formatDate(dob.date);
	const phoneNum = createElement('p', 'phone', formattedPhone);
	const address = createElement('p', 'address', streetAddress);
	const birthday = createElement('p', 'birthday', `Birthday: ${formattedDate}`);

	const subDataElements = [phoneNum, address, birthday];
	appendItems(parentElement, subDataElements);
}

function generateOverlay(user) {
	overlay.style.display = 'block';
	overlayData.style.display = 'flex';

	const closeBtn = createElement('button', 'close-overlay', 'Close');
	const mainDataDiv = createElement('div', 'main-data');
	generateMainData(mainDataDiv, user, 'large');

	const subDataDiv = createElement('div', 'sub-data');
	generateSubData(subDataDiv, user);

	const dataElements = [closeBtn, mainDataDiv, subDataDiv];
	appendItems(overlayData, dataElements);
}

// Helper Functions
function createElement(ele, className = null, textContent = null) {
	const element = document.createElement(ele);
	element.textContent = textContent;
	element.className = className;
	return element;
}

function formatPhoneNumber(phone) {
	if (phone[4] === ')') return `${phone.slice(0, 5)} ${phone.slice(6)}`;
	return phone;
}

function formatDate(dateString) {
	const date = new Date(dateString);
	const month = padNumWithZeros(date.getMonth() + 1, 2);
	const day = padNumWithZeros(date.getDate(), 2);
	const year = date.getYear();
	console.log(`${month}/${day}/${year}`);
	return `${month}/${day}/${year}`;
}

function padNumWithZeros(num, targetLength) {
	return num.toString().padStart(targetLength, '0');
}

function streetAddressBuilder(locationObj) {
	const addNumber = locationObj.street.number;
	const streetName = locationObj.street.name;
	const city = locationObj.city;
	const state = locationObj.state;
	const postCode = locationObj.postcode;
	console.log(`${addNumber} ${streetName} ${city}, ${state} ${postCode}`);
	return `${addNumber} ${streetName} ${city}, ${state} ${postCode}`;
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

// Event Listener
document.addEventListener('DOMContentLoaded', () => getRandomUsers(usersUrl));
employees.addEventListener('click', handleCardClick);
overlay.addEventListener('click', closeOverlay);
