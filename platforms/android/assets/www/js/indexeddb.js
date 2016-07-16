// Modified by Luke Glasscock from W3C Indexed Database API instructional documentation located at https://www.w3.org/TR/IndexedDB/

(function () {

  const studentData = [
    { snumber: "111111", name: "Fred Fredrickson", teacher: "Mrs. Sullivan", grade: "2", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111112", name: "John Johnson", teacher: "Mrs. Scott", grade: "3", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111113", name: "Rick Meme", teacher: "Mrs. Scott", grade: "3", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111114", name: "Jack Taylor", teacher: "Mrs. Scott", grade: "3", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111115", name: "Ronny Jimble", teacher: "Mrs. Scott", grade: "3", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111116", name: "Fred Lowe", teacher: "Mrs. Scott", grade: "3", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111117", name: "Amy Sustaimy", teacher: "Mrs. Scott", grade: "3", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111118", name: "Valerie Melle", teacher: "Mrs. Scott", grade: "3", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111119", name: "Trada Joe", teacher: "Mrs. Scott", grade: "3", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111120", name: "Charles Xavier", teacher: "Mrs. Perkins", grade: "4", school: "Marstellar E.S.", school_page: "marstellar-es.html"},
    { snumber: "111121", name: "Chuck Norris", teacher: "Mr. Herbert", grade: "1", school: "Bristow Run E.S.", school_page: "bristow-run-es.html"},
    { snumber: "111122", name: "Frank Kasta", teacher: "Mrs. Tran", grade: "K", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111123", name: "Johnny Maloney", teacher: "Mrs. Travis", grade: "1", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111124", name: "Tammie Lydel", teacher: "Mrs. Sharpe", grade: "4", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111125", name: "Susy Chloe", teacher: "Mr. Rindell", grade: "5", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111126", name: "Jim Bobbe", teacher: "Mr. Cready", grade: "6", school: "Cedar Point E.S.", school_page: "cedar-point-es.html"},
    { snumber: "111127", name: "Chucky Cheez", teacher: "Mrs. Travis", grade: "1", school: "Bristow Run E.S.", school_page: "bristow-run-es.html"}
  ];

  const DB_NAME = "school-test-db1";
  const DB_VERSION = "1";
  const DB_STORE_NAME = "students"
  var db;

  // Used to keep track of which view is displayed to avoid uselessly reloading it
  var current_view_pub_key;

  function openDb() {
    console.log("openDb ...");
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) {
      // Better use "this" than "req" to get the result to avoid problems with garbage collection
      // db = req.result;
      db = this.result;
      console.log("openDb DONE");

      // Add studentData to DB
      var transaction = db.transaction(["students"], "readwrite");
      var objectStore = transaction.objectStore("students");
      for (var i in studentData) {
        var request = objectStore.add(studentData[i]);
        request.onsuccess = function(event) {
          console.log("Insert studentData: Success");
          // event.target.result == studentData[i].ssn;
        };
      }

      displayDbList();
    };
    req.onerror = function (evt) {
      console.error("openDb: ", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
      console.log("openDb.onupgradeneeded");
      var store = evt.currentTarget.result.createObjectStore(DB_STORE_NAME, { keyPath: 'snumber' });

      store.createIndex('name', 'name', { unique: false });
      store.createIndex('teacher', 'teacher', { unique: false });
      store.createIndex('grade', 'grade', { unique: false });
      store.createIndex('school', 'school', { unique: false });
      store.createIndex('school_page', 'school_page', { unique: false });
    };
  }

  /**
   * @param {string} store_name
   * @param {string} mode either "readonly" or "readwrite"
   */
  function getObjectStore(store_name, mode) {
    console.log("getObjectStore");
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
  }

  function clearObjectStore(store_name) {
    console.log("clearObjectStore");
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req = store.clear();
    req.onsuccess = function(evt) {
      displayActionSuccess("Store cleared");
      displayDbList(store);
    };
    req.onerror = function (evt) {
      console.error("clearObjectStore:", evt.target.errorCode);
      displayActionFailure(this.error);
    };
  }

  /**
   * @param {IDBObjectStore=} store
   */
  function displayDbList(store) {
    console.log("displayDbList");

    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME, 'readonly');

    var list_focus;
    var list_count;
    var list_all;
    var req;
    var index;

    // The following if/else statements are created for future enhancements
    // Detect pages
    if ($("#school-list")[0]) {
       list_focus = "Schools";
       //index = store.index('school');
       list_all = $('#school-list');
       list_all.empty();
    }
    else if ($("#grade-level")[0]) {
       list_focus = "Grades";
       //index = store.index('grade');
    }
    else if ($("#teacher-list")[0]) {
       list_focus = "Teachers";
       //index = store.index('teacher');
    }
    // STUDENT LIST
    else if ($("#student-list")[0]) {
       list_focus = "Students";
       //index = store.index('student');
       list_count = $('#student-count');
       list_count.empty();
       list_all = $('#student-list');
       list_all.empty();
    }
    req = store.count();


    // Requests are executed in the order in which they were made against the
    // transaction, and their results are returned in the same order.
    // Thus the count text below will be displayed before the actual pub list
    // (not that it is algorithmically important in this case).
    req.onsuccess = function(evt) {
      console.log("Total " + list_focus + ": " + evt.target.result);
      //list_count.append("Total " + list_focus + ": " + evt.target.result);
    };
    req.onerror = function(evt) {
      console.error("add error", this.error);
      displayActionFailure(this.error);
    };

    req = store.openCursor();
    req.onsuccess = function(evt) {
      var cursor = evt.target.result;
      console.log("openCursor", cursor);

      // If the cursor is pointing at something, ask for the data
      if (cursor) {
        console.log("displayDbList cursor:", cursor);
        req = store.get(cursor.key);
        req.onsuccess = function (evt) {
          var value = evt.target.result;
          var list_item;

          if (list_focus == "Schools") {
              list_item = $('<div class="col-md-12 "><a href="' + value.school_page + '" class="btn btn-default btn-raised btn-lg btn-block">' + value.school + '</a></div>');
          }
          else if (list_focus == "Grades") {

          }
          else if (list_focus == "Teachers") {

          }
          else if (list_focus == "Students") {
             list_item = $('<div class="col-md-12 "><a href="fred_fredrickson.html" class="btn btn-default btn-raised btn-lg btn-block">' + value.name + '</a></div>');
          }
          list_all.append(list_item);
        };

        // Move on to the next object in store
        cursor.continue();

      } else {
        console.log("No more entries");
      }
    };
  }

  openDb();


})(); // Immediately-Invoked Function Expression (IIFE)