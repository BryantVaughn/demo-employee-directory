// Global variables
const usersUrl = 'https://randomuser.me/api/?results=12&nat=us';
const overlay = document.querySelector('.overlay');
const overlayData = document.querySelector('.overlay-data');
const search = document.querySelector('.search');
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
	const { cell, location, dob } = user;
	const formattedCell = formatPhoneNumber(cell);
	const streetAddress = streetAddressBuilder(location);
	const formattedDate = formatDate(dob.date);
	const phoneNum = createElement('p', 'phone', formattedCell);
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
	return `${month}/${day}/${year}`;
}

function padNumWithZeros(num, targetLength) {
	return num.toString().padStart(targetLength, '0');
}

function streetAddressBuilder(locationObj) {
	const addNumber = locationObj.street.number;
	const streetName = locationObj.street.name;
	const city = locationObj.city;
	const state = abbrState(locationObj.state);
	const postCode = locationObj.postcode;
	return `${addNumber} ${streetName} ${city}, ${state} ${postCode}`;
}

function appendItems(parentNode, itemsToAppend) {
	itemsToAppend.forEach((item) => parentNode.appendChild(item));
}

function abbrState(inputState) {
	const states = [
		['Arizona', 'AZ'],
		['Alabama', 'AL'],
		['Alaska', 'AK'],
		['Arkansas', 'AR'],
		['California', 'CA'],
		['Colorado', 'CO'],
		['Connecticut', 'CT'],
		['Delaware', 'DE'],
		['Florida', 'FL'],
		['Georgia', 'GA'],
		['Hawaii', 'HI'],
		['Idaho', 'ID'],
		['Illinois', 'IL'],
		['Indiana', 'IN'],
		['Iowa', 'IA'],
		['Kansas', 'KS'],
		['Kentucky', 'KY'],
		['Louisiana', 'LA'],
		['Maine', 'ME'],
		['Maryland', 'MD'],
		['Massachusetts', 'MA'],
		['Michigan', 'MI'],
		['Minnesota', 'MN'],
		['Mississippi', 'MS'],
		['Missouri', 'MO'],
		['Montana', 'MT'],
		['Nebraska', 'NE'],
		['Nevada', 'NV'],
		['New Hampshire', 'NH'],
		['New Jersey', 'NJ'],
		['New Mexico', 'NM'],
		['New York', 'NY'],
		['North Carolina', 'NC'],
		['North Dakota', 'ND'],
		['Ohio', 'OH'],
		['Oklahoma', 'OK'],
		['Oregon', 'OR'],
		['Pennsylvania', 'PA'],
		['Rhode Island', 'RI'],
		['South Carolina', 'SC'],
		['South Dakota', 'SD'],
		['Tennessee', 'TN'],
		['Texas', 'TX'],
		['Utah', 'UT'],
		['Vermont', 'VT'],
		['Virginia', 'VA'],
		['Washington', 'WA'],
		['West Virginia', 'WV'],
		['Wisconsin', 'WI'],
		['Wyoming', 'WY']
	];

	const stateArr = states.filter((state) => {
		return state[0] === inputState;
	});

	const stateAbbr = stateArr[0][1];
	return stateAbbr;
}

// Event Handlers
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

// Search Functionality
function filterEmployees(evt) {
	const filteredUsers = [];
	randomUsers.forEach((user, idx) => {
		const searchVal = evt.target.value.toLowerCase();
		const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
		if (fullName.includes(searchVal)) {
			const idxStr = `${idx}`;
			filteredUsers.push({ ...user, idxStr });
		}
	});
	updateUsers(filteredUsers);
}

function updateUsers(usersList) {
	const indexList = usersList.map((user) => user.idxStr);

	const userCards = employees.querySelectorAll('.card');
	for (let userCard of userCards) {
		if (!indexList.includes(userCard.id)) {
			userCard.style.display = 'none';
		} else {
			userCard.style.display = '';
		}
	}
}

// Event Listener
document.addEventListener('DOMContentLoaded', () => getRandomUsers(usersUrl));
search.addEventListener('keyup', filterEmployees);
employees.addEventListener('click', handleCardClick);
overlay.addEventListener('click', closeOverlay);
