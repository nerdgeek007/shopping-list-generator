// select shopping form and list
const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// we need an array to hold our state
let items = [];

// stop the default behaviour of submit button
function handleSubmit(e) {
	e.preventDefault();
	const name = e.currentTarget.item.value;
	//grab the item with a unique id
	const item = {
		name,
		id: Date.now(),
		complete: false,
	};
	//push these items into state
	items.push(item);
	// clear the form
	e.target.reset();
	//dispatch an custom event
	list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

// display the items into the list
function displayItems() {
	const html = items
		.map(
			item => `<li class="shopping-item">
      <input type="checkbox" value="${item.id}" ${
				item.complete ? 'checked' : ''
			}>
      <span class="itemName">${item.name}</span>
      <button aria-label="Remove ${item.name}" value="${item.id}">×</button>
  </li>`
		)
		.join('');
	list.innerHTML = html;
}

function mirrorToLocalStorage() {
	localStorage.setItem('items', JSON.stringify(items));
}

function restoreFromLocalStorage() {
	const lsItems = JSON.parse(localStorage.getItem('items'));

	if (lsItems.length) {
		lsItems.forEach(item => items.push(item));
		list.dispatchEvent(new CustomEvent('itemsUpdated'));
	}
}

function deleteItem(id) {
	//updates the array without this one
	items = items.filter(item => item.id !== id);
	list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
	const itemRef = items.find(item => item.id === id);
	itemRef.complete = !itemRef.complete;
	list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);

//event delegation: delegate the click event from list to the delete button
list.addEventListener('click', function (e) {
	const id = parseInt(e.target.value);
	if (e.target.matches('button')) {
		deleteItem(id);
	}
	if (e.target.matches('input[type="checkbox"]')) {
		markAsComplete(id);
	}
});

restoreFromLocalStorage();
