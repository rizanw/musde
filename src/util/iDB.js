
const nameInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');
let db;

window.onload = function () {
    // create db if not exist
    let request = window.indexedDB.open('musde_db', 1);

    // error handler 
    request.onerror = function () {
        console.log("database failed to open");
    }

    // succes handler : create db if succes
    request.onsuccess = function () {
        console.log("database opened succesfully");
        db = request.result;
    };


    // Setup the database tables if this has not already been done
    request.onupgradeneeded = function (e) {

        // Grab a reference to the opened database
        let db = e.target.result;

        // Create an objectStore to store our notes in (basically like a single table)
        // including a auto-incrementing key
        let objectStore = db.createObjectStore('musde_db', { keyPath: 'id', autoIncrement: true });

        // Define what data items the objectStore will contain
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('score', 'score', { unique: false });

        console.log('Database setup complete');
    };
}


// Define the addData() function
export function addData(name, score) { 
    // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
    let newItem = { name: name, score: score };

    // open a read/write db transaction, ready for adding the data
    let transaction = db.transaction('musde_db', 'readwrite');

    // call an object store that's already been added to the database
    let objectStore = transaction.objectStore('musde_db');

    // Make a request to add our newItem object to the object store
    var request = objectStore.add(newItem);

    request.onsuccess = function () {
        console.log("adding object succesfully");
    };

    // Report on the success of the transaction completing, when everything is done
    transaction.oncomplete = function () {
        console.log('Transaction completed: database modification finished.');
    };

    transaction.onerror = function () {
        console.log('Transaction not opened due to error');
    };

    return transaction.oncomplete ? true : false;
}

var countTop = 0;
// Define the displayData() function
export function displayTopSeven() {
    // Here we empty the contents of the list element each time the display is updated
    // If you ddn't do this, you'd get duplicates listed each time a new note is added
    var row = document.querySelector('tbody');
    while (row.firstChild) {
        row.removeChild(row.firstChild)
    }

    // Open our object store and then get a cursor - which iterates through all the
    // different data items in the store
    var keyRange = IDBKeyRange.lowerBound("score", false);
    let objectStore = db.transaction(['musde_db'], "readonly").objectStore('musde_db');

    objectStore.index('score').openCursor(null, 'prev').onsuccess = function (e) {
        let cursor = e.target.result; 

        if(cursor) {
            cursor.continue();
            countTop+=1;
            if(countTop <= 7){  
                var tableRef = document.getElementById('score-table');
                var newRow = tableRef.insertRow(-1);
                var cellRank = newRow.insertCell(0);
                var cellScore = newRow.insertCell(1);
                var cellName = newRow.insertCell(2);
                cellRank.innerHTML = countTop;
                cellScore.innerHTML = cursor.value.score;
                cellName.innerHTML = cursor.value.name;
            }
        }else{
            // console.log('Notes all displayed');
        }
    }
}