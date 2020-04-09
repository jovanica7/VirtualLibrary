function register(event) {
  event.preventDefault();
  
  var firstName = document.getElementById("firstName");
  var lastName = document.getElementById("lastName");
  var username = document.getElementById("username");
  var email = document.getElementById("email");
  var password = document.getElementById("password");
 
  var newUser =
  {
	  "firstName": 		firstName.value,
	  "lastName": 		lastName.value,
	  "username": 		username.value,
	  "email": 			email.value,
	  "password": 		password.value,
	  "whishlist":  	[]
  }
  
  if(localStorage.currentUser) {
		if(checkIfExists(newUser))
			return;
		
		var current = localStorage.getObj("currentUser");
		
		if(
		newUser.firstName === current.firstName &&
		newUser.lastName === current.lastName &&
		newUser.username === current.username &&
		newUser.email === current.email &&
		newUser.password === current.password) {
			alert("Please modify at least one field or close the modal to cancel.");
		}
		
		else {
			var whishlist = current.whishlist;
			newUser.whishlist = whishlist;
			var users = localStorage.getObj("users");
			var index = indexOfObject(current, users);
			
			// replace current user
			localStorage.setObj("currentUser", newUser);
			
			// update list of all users
			users.splice(index, 1, newUser);
			localStorage.setObj("users", users);
			
			//update page info
			getProfileInfo();
			
			document.getElementById("userExists").style.display = "none";
			alert("Update successful!");
		}
		
		
  }
  
  else {
	  localStorage.setObj("users", addOrUpdateUser(newUser));
  }
	
}

function addOrUpdateUser(data){
	if(!checkIfExists(data)) {
		var users = localStorage.getObj("users");
		users.push(data);
		window.location.replace("index.html");
	}
    
    return users;
}

function checkIfExists(data) {
	var users = localStorage.getObj("users");
	// if this is actually update of current user, remove current username from the checklist	
	if(localStorage.currentUser) {
		var current = localStorage.getObj("currentUser");
		var index = indexOfObject(current, users);
		users.splice(index, 1);
		localStorage.setObj("users", users);
	}
	var exists = false;
    if(users === null) {
	  users = [];
	  localStorage.setObj("users", users);
	}
	else {	
		users.forEach(
			user => {
				if (user.username === data.username) {
							document.getElementById("userExists").style.display = "block";
							exists = true;
							return;				
				}
			}
		);
	}
	
	return exists;
}



function login(event) {
  event.preventDefault();
  var users = localStorage.getObj("users");
  // if there are no users in local storage
  if(users === null) {
	  alert("Please register first. You will be redirected to a registration page.");
	  window.location.replace("register.html");
  }
  else {
	  var exists = false;
	  var username = document.getElementById("username").value;
	  var password = document.getElementById("password").value;
		users.forEach(
			user => {
				if (user.username === username && user.password === password) {
					exists = true;
					localStorage.setObj("currentUser", user);
					window.location.replace("home.html");
					
				}
			}
		);
	  if(!exists) {
		  document.getElementById("userInvalid").style.display = "block";
	  }
		 
	}
}

function redirectToRegistration() {
	window.location.replace("register.html");
}

function searchBooks(event) {
	event.preventDefault();
	document.getElementById("highlight").disabled = true;
	// remove results from the previous iteration
	if(document.getElementById("result").hasChildNodes()) {
		document.getElementById("result").innerHTML = "";
	}
	var search = document.getElementById("bookName").value;
	if(search === "") {
		document.getElementById("emptyBookList").classList.remove("showSearchAlert");
		document.getElementById("emptySearch").classList.add("showSearchAlert");	
	}
	
	else {
		fetchBooks(search);
		document.getElementById("emptySearch").classList.remove("showSearchAlert");
		
	}
}

async function fetchBooks (input) {
	var response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${input}&orderBy=newest&maxResults=36`);
	var books = await response.json();
	presentResults(books);	
}
	
function presentResults(results) {
	// remove results from the previous iteration
	if(document.getElementById("result").hasChildNodes()) {
		document.getElementById("result").innerHTML = "";
	}
	
	if(results.totalItems === 0) {
		document.getElementById("emptyBookList").classList.add("showSearchAlert");
	}
	
	else {
		createAndPopulateBookDetails(results.items, true);
		document.getElementById("emptyBookList").classList.remove("showSearchAlert");
		document.getElementById("highlight").disabled = false;
	}

}

function createAndPopulateBookDetails(books, home) {
	for(i = 0; i < books.length; i++) {
		 var row; 
		 if(i % 3 === 0) {
			row = document.createElement("div");
			row.className = "row";
		    document.getElementById("result").appendChild(row);
		 }
		 
		// create 3 columns for one row
		var col = document.createElement("div"); 
		col.className = "col-md-4";
		row.appendChild(col);
		
		// set bookId
		var bookId = books[i].id;
			
		// create book-info div
		bookInfo = document.createElement("div"); 
		bookInfo.className =  "bookInfo";
		// set id of the bookInfo div
		bookInfo.setAttribute("id", `book${bookId}`);
		col.appendChild(bookInfo);
		
		// create div for author and title
		var titleAuthorDiv = document.createElement("div");
		titleAuthorDiv.className = "titleAuth";
		bookInfo.appendChild(titleAuthorDiv);
		
		// create title and author elements
		var titleElem = document.createElement("h6");
		titleAuthorDiv.appendChild(titleElem);
		var authorElem = document.createElement("p");
		titleAuthorDiv.appendChild(authorElem);
		
		// create div for image
		var imgDiv = document.createElement("div");
		imgDiv.className = "imgDiv";
		bookInfo.appendChild(imgDiv);
		
		// make image clickable
		var imgClickable = document.createElement("a");
		imgDiv.appendChild(imgClickable);
		
		// create image element
		var imgElem = document.createElement("img");
		imgElem.className = "imgSize";
		imgClickable.appendChild(imgElem);
		
		// create description element
		var descrElem = document.createElement("p");
		descrElem.className = "desc";
		bookInfo.appendChild(descrElem);
		
		// create div for buttons
		var btnDiv = document.createElement("div");
		btnDiv.className = "btnDiv";
		bookInfo.appendChild(btnDiv);
		
		// make button "Read More" clickable
		var btnClickable = document.createElement("a");
		btnDiv.appendChild(btnClickable);
		
		// create "Read More" button
		var readMore = document.createElement("button");
		readMore.className = "btn btn-info readMore";
		btnClickable.appendChild(readMore);
		readMore.innerHTML = "Read More"
		
		if(home) {
			// create "Add to Whishlist" button
			var addToWishlist = document.createElement("button");
			addToWishlist.className = "btn btn-success";
			// set id of the button to have id of the book
			addToWishlist.setAttribute("id", bookId);
			// call add-to-whishlist function
			addToWishlist.onclick = function(event) {
				addBookToWishlist(event);
			}
			btnDiv.appendChild(addToWishlist);
			addToWishlist.innerHTML = "+ Add to Whishlist";			
		}

		else {
			// create "Remove from Whishlist" button
			var removeToWishlist = document.createElement("button");
			removeToWishlist.className = "btn btn-danger";
			// set id of the button to have id of the book
			var bookId = books[i].id;
			removeToWishlist.setAttribute("id", bookId);
			// call remove-from-whishlist function
			removeToWishlist.onclick = function(event) {
				removeBookFromWishlist(event);
			}
			btnDiv.appendChild(removeToWishlist);
			removeToWishlist.innerHTML = "- Remove from Whishlist";
		}
		
		
		// fill the title element
		if(books[i].volumeInfo.title) {
			var title = books[i].volumeInfo.title;
			// some items have multiple titles, this picks first one
			if(title.includes(",")) {
				titleElem.innerHTML = title.substring(0, title.indexOf(","));
			}
			else {
				titleElem.innerHTML = title;
			}	
		}
		
		// fill the author element 
		if(books[i].volumeInfo.authors) {
			var author = books[i].volumeInfo.authors[0];
			authorElem.innerHTML = "By " + author;	
		}
		
		// fill the details for clickable elements
		if(books[i].volumeInfo.infoLink) {
			var info = books[i].volumeInfo.infoLink;
			imgClickable.setAttribute("href", info);
			imgClickable.setAttribute("target", "_blank");
			btnClickable.setAttribute("href", info);
			btnClickable.setAttribute("target", "_blank");
		}
		
		// fill the image source and alt attributes
		if(books[i].volumeInfo.imageLinks)
		var url = books[i].volumeInfo.imageLinks.thumbnail;
		imgElem.setAttribute("src", url); 
		imgElem.setAttribute("alt", "No picture available");
		
		// fill the description element 
		if(books[i].volumeInfo.description) {
			// shorting the innerHTML which will improve performance
			var description =  books[i].volumeInfo.description.substring(0, 60);
			descrElem.innerHTML = description;
		}
	}
}

function addBookToWishlist(event) {
	var current = localStorage.getObj("currentUser");
	var users = localStorage.getObj("users");
	var index = indexOfObject(current, users);
	
	// check if whishlist reached maximum
	if(current.whishlist.length === 30) {
		alert("Maximum number of books (30) in the whishlist reached!");
		return;
	}
	
	// update current's user whishlist
	else if(current.whishlist.indexOf(event.srcElement.id) !== -1) {
		alert("This book is already in the whishlist!");
	}
	
	else {
		current.whishlist.push(event.srcElement.id);
		localStorage.setObj("currentUser", current);
	
		// update list of all users
		users.splice(index, 1, current);
		localStorage.setObj("users", users);
	
		document.getElementById(event.srcElement.id).disabled = true;
	}
	
}

function removeBookFromWishlist(event) {
	var txt;
	if (confirm("Are you sure you want to remove this book from whishlist?")) {
		var current = localStorage.getObj("currentUser");
		var users = localStorage.getObj("users");
		var index = indexOfObject(current, users);
		
		// update current's user whishlist
		var windex = current.whishlist.indexOf(event.srcElement.id);
		current.whishlist.splice(windex, 1);
		localStorage.setObj("currentUser", current);
		
		// update list of all users
		users.splice(index, 1, current);
		localStorage.setObj("users", users);
		
		document.getElementById(`book${event.srcElement.id}`).classList.add("removed");
		document.getElementById(event.srcElement.id).disabled = true;
	} 
}

async function populateUserWhishlist(books) {
	var results = [];
	// call Google API for book details, based on book id
	for(var bookId of books) {
		var response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
		var bookInfo = await response.json();
		results.push(bookInfo);
	}
	return results;
}

async function createWhishlist() {
		// show the wishlist on button click
		if(document.getElementById("viewWhishlist").innerHTML === "View Whishlist") {
			await getUserWhishlist();
		}
		
		// hide the wishlist on button click
		else {
			document.getElementById("refreshWhishlist").style.visibility = "hidden";
			document.getElementById("result").innerHTML = "";
			document.getElementById("viewWhishlist").innerHTML = "View Whishlist"; 
		}

}

async function refreshWhishlist() {
	document.getElementById("result").innerHTML = "";
	await getUserWhishlist();
}

async function getUserWhishlist() {
	var current = localStorage.getObj("currentUser");
	var whishlist = current.whishlist;
	// wait for API calls to finish
	var books = await populateUserWhishlist(whishlist);
	// check if whishlist is empty
	if(books.length === 0) {
		document.getElementById("result").innerHTML = "";
		document.getElementById("refreshWhishlist").style.visibility = "hidden";
		document.getElementById("viewWhishlist").innerHTML = "View Whishlist";
		alert("Your whishlist is empty!");
	}
	// populate the whishlist on button click
	else {
		createAndPopulateBookDetails(books, false);
		document.getElementById("viewWhishlist").innerHTML = "Hide Whishlist";
		document.getElementById("refreshWhishlist").style.visibility = "visible";
	}
}

function getProfileInfo() {
	var current = localStorage.getObj("currentUser");
	document.getElementById("profileInfo").innerHTML = 
	"<b>" + "First Name - " + "</b>"  + current.firstName + "<br />" +
	"<b>" + "Last Name - " + "</b>"  + current.lastName + "<br />" +
	"<b>" + "Username - " + "</b>"  + current.username + "<br />" +
	"<b>" + "Email - " + "</b>"  + current.email + "<br />" + 
	"<b>" + "Password - " + "</b>"  + current.password;
	fillFormWithUserData(current);
}

function removePreviousUser() {
	if(localStorage.getObj("currentUser")) {
		localStorage.removeItem("currentUser");
	}
	
}

function highlight() {
	var titles = document.getElementsByTagName("h6");
	var authAndDesc = document.getElementsByTagName("p");
	boldInnerText(titles);
	boldInnerText(authAndDesc);
	
}

function boldInnerText(outerTxt) {
	var searchedBook = document.getElementById("bookName").value.toLowerCase();
	for(i = 0; i < outerTxt.length; i++) {
			var innerHTML = outerTxt[i].innerHTML;
		if(innerHTML.toLowerCase().indexOf(searchedBook) >= 0) {
			var index = innerHTML.toLowerCase().indexOf(searchedBook);
			outerTxt[i].innerHTML = innerHTML.substring(0, index) + "<span class='highlight'>" + innerHTML.substring(index, index + searchedBook.length) + "</span>" + innerHTML.substring(index + searchedBook.length);
			
		}
	}	
}

function indexOfObject(obj, array) {
    var i;
    for (i = 0; i < array.length; i++) {
        if (JSON.stringify(array[i]) === JSON.stringify(obj)) {
            return i;
        }
    }
}

function clearForm() {
	document.getElementById("userExists").style.display = "none";
}

function fillFormWithUserData(currentUser) {
	document.getElementById("firstName").value = currentUser.firstName;
	document.getElementById("lastName").value = currentUser.lastName;
	document.getElementById("username").value = currentUser.username;
	document.getElementById("email").value = currentUser.email;
	document.getElementById("password").value = currentUser.password;
}


Storage.prototype.setObj = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

  Storage.prototype.getObj = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

