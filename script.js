const itemInput = document.getElementById('item-input');
const itemForm = document.getElementById('item-form');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');

//-------------------------------------------------------------
//-------------------------------------------------------------
// DISPLAY ITEMS
/* 
This function assumes the existence of three other functions:
getItemsFromStorage(): Retrieves items from storage.
addItemToDom(item): Adds an item to the DOM.
checkUI(): Checks the UI after adding items. 
*/
function displayItems(){
// Retrieve items from storage
const itemsFromStorage = getItemsFromStorage();
// Iterate over each item and add it to the DOM
itemsFromStorage.forEach(item => addItemToDom(item));
// Check the UI after adding items
checkUI ();
}; 
/* Finally, it returns the array of items, whether it's an empty 
array or an array with items retrieved from localStorage. */
function getItemsFromStorage()  {
    // Initialize a variable to store retrieved items
    let itemsFromStorage;
    // Check if the 'items' key exists in localStorage
    if (localStorage.getItem('items') === null) {
  // If not, initialize itemsFromStorage as an empty array
    itemsFromStorage = [];
    } else {
  // If the 'items' key exists, parse the JSON string stored in it
  // and assign it to itemsFromStorage
    itemsFromStorage =  JSON.parse(localStorage.getItem('items'));
    }
  // Return the retrieved items
    return itemsFromStorage;
 };

//-------------------------------------------------------------
//-------------------------------------------------------------
// ADDING ITEMS
function onItemSubmit (e) {
e.preventDefault(); // Prevent the default form submission behavior
const newItem = itemInput.value;  // Retrieve the value entered in the input field
// Validate Input
if (newItem === '') {// If the input is empty, display an alert message and return, preventing further execution
alert('Please add an item');
return; // This prevents further execution of the function in case the input is empty.
}
if (isEditMode) { // Check for edit mode
    const itemToEdit = itemList.querySelector('.edit-mode');
    // Check if the new item already exists before updating
    if (checkIfItemExists(newItem, itemToEdit)) {
        alert('This item already exists!');
        return;
    }
    removeItemFromStorage(itemToEdit.textContent);// Remove the item being edited from storage
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();    // Remove the item being edited from the UI
    isEditMode = false;
} else {
    // Handle the case when not in edit mode (adding a new item)
    if (checkIfItemExists(newItem)) {
        alert('This item already exists!');
        return;
    }
}
addItemToDom(newItem);// Add the new item to the DOM
addItemToStorage(newItem);// Add the new item to storage
checkUI();// Check the UI (e.g., to show the Filter box and Clear All Button)
itemInput.value = '';// Clear the input field
};

function addItemToDom(item){
 // Create a new list item element
const li = document.createElement('li');
// Set the text content of the list item to the provided item
li.appendChild(document.createTextNode(item));
// Create a remove button for the list item
const button = createButton('remove-item btn-link text-red');
// Append the remove button to the list item
li.appendChild(button);
// Append the list item to the item list (assuming itemList is a ul or ol element)
itemList.appendChild(li);
};
function addItemToStorage(item) {
    // Retrieve items from localStorage
    let itemsFromStorage;
    // Check if 'items' key exists in localStorage
    if (localStorage.getItem('items') === null) {
     // If not, initialize itemsFromStorage as an empty array
     itemsFromStorage = [];
    } else {
    // If the 'items' key exists, parse the JSON string stored in it
    itemsFromStorage =  JSON.parse(localStorage.getItem('items'));
    }
   // Push the new item into the itemsFromStorage array
    itemsFromStorage.push(item);
   // Store the updated items back into localStorage, stringify to store as JSON
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
 };

//-------------------------------------------------------------
//-------------------------------------------------------------

// UPDATE ITEMS AND RESET STATE
function setItemToEdit(item) {
    // Remove 'edit-mode' class from all list items
    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));
    // Set isEditMode flag to true
    isEditMode = true;
    // Add 'edit-mode' class to the item being edited
    item.classList.add('edit-mode'); // Use add() method to add the class where the click happens
    // Update form button content and styling for update mode
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    // Set input field value to item's text content for editing
    itemInput.value = item.textContent;
 };


//-------------------------------------------------------------
//-------------------------------------------------------------
// REMOVE ITEMS
/* The removeItem function then receives this parent element (item) as its argument and proceeds to 
remove it from the DOM after confirming with the user. */
/* So, essentially, item in the removeItem function refers to the parent element of the clicked button, and 
it's passed from the onClickItem function where we determine which item to remove based on the click event. */
function removeItem(item) {
    if (confirm('Are you sure?')) {
    // Remove Item from DOM
    item.remove();
    // Remove Item from Storage
    removeItemFromStorage(item.textContent);
    checkUI();
    }
    };
    function removeItemFromStorage(item){
    // Retrieve items from storage
    let itemsFromStorage = getItemsFromStorage();
    // Filter out items to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
    // Update the storage with the filtered items
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
    };
    
    //------------------------------------------------------
    //------------------------------------------------------
    // CLEAR ITEMS
    function clearItems () {
    // Clear from the DOM
    while (itemList.firstChild) { //This loop will continue executing as long as itemList.firstChild (being the li) evaluates to true.
    itemList.removeChild(itemList.firstChild); //This line removes the first child node of itemList
    } // removeChild() method expects a parameter specifying the child node to remove, and if it's missing or null, it will throw an error.
    // Clear from the Local Storage
    localStorage.removeItem('items');
    checkUI () 
    };
    
 
//-------------------------------------------------------------
//-------------------------------------------------------------
// CREATE BUTTON
function createButton (classes) {
const button = document.createElement('button'); // this is the tag you want to use
button.className =  classes;
const icon = createIcon('fa-solid fa-xmark');
button.appendChild(icon);
return button; //the return statement is used to specify the value that the function will produce when it is called.
};

// CREATE ICON
function createIcon (classes) {
    const icon = document.createElement('i'); // this is the tag you want to use
    icon.className =  classes;
    return icon; //the return statement is used to specify the value that the function will produce when it is called.
};

//-------------------------------------------------------------
//-------------------------------------------------------------
// THIS IS THE HANDLER OF THE CLICK EVENT
/* In the onClickItem function, the e parameter represents the event object that is passed when an element is clicked. 
We're using event delegation to capture clicks on elements within a container. */
function onClickItem(e){ 
    if (e.target.parentElement.classList.contains('remove-item')) { 
   /* Inside the onClickItem function, we check if the clicked element itself contains the class 'remove-item'. If it does, 
   we call the removeItem function and pass the parent element of the clicked button (e.target.parentElement.parentElement) as 
   an argument.  */  
   removeItem(e.target.parentElement.parentElement);
       } else {
   setItemToEdit(e.target);
    }
   };
// We remove the Filter and Clear All Items button when there is nothing to clear or filter
function checkUI () {
// this will get all the list items. Output is a nodelist similar to an array
const items = itemList.querySelectorAll('li'); 
if (items.length === 0){
clearButton.style.display = 'none';
itemFilter.style.display = 'none';
} else {
clearButton.style.display = 'block';
itemFilter.style.display = 'block';
}
formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
formBtn.style.backgroundColor = '#333';
itemInput.value = '';
isEditMode = false;
};

// FILTER ITEMS
function filterItems(e) {
const items = itemList.querySelectorAll('li');
const text = e.target.value.toLowerCase(); // this will get all the list items. Output is a nodelist similar to an array
console.log(text);
// then you need to get the text you write in the filter
// you need to define it here too otherwise it will not change once the page is loaded
items.forEach((item) => {
const itemName = item.firstChild.textContent.toLowerCase();
if (itemName.indexOf(text) != -1)  {
item.style.display = 'flex';
} else {
    item.style.display = 'none';
}
}  
)
};
//------------------------------------------------
//------------------------------------------------
// CHECK IF ITEM ALREADY EXIST
function checkIfItemExists(newItem, currentItem) {
    const itemsFromStorage = getItemsFromStorage();
        // If currentItem is provided, exclude it from the check
    if (currentItem) {
        return itemsFromStorage.filter(item => item !== currentItem.textContent).includes(newItem);
    } else {
        return itemsFromStorage.includes(newItem);
    }
};

function init() {
let isEditMode = false; // when it comes to update a page this is necessary and we are talking about a state.
// Event Listeners
itemForm.addEventListener('submit', onItemSubmit);
itemList.addEventListener('click', onClickItem);
clearButton.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);
checkUI (); 
};
init();
