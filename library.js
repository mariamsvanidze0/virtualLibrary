// Reviver to convert date strings back to Date objects
function reviver(key, value) {
  if (key === 'borrowDate' || key === 'dueDate') {
    return new Date(value);
  }
  return value;
}

//  hardcoded initial books 
const initialBooks = [
  {
    id: 1,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    year: 1949,
    rating: 4.8,
    isAvailable: true,
    borrowCount: 0
  },
  {
    id: 2,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    year: 1937,
    rating: 4.7,
    isAvailable: true,
    borrowCount: 0
  },
  {
    id: 3,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    year: 1813,
    rating: 4.5,
    isAvailable: true,
    borrowCount: 0
  },
  {
    id: 4,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic",
    year: 1960,
    rating: 4.9,
    isAvailable: true,
    borrowCount: 0
  },
  {
    id: 5,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    year: 1925,
    rating: 4.4,
    isAvailable: true,
    borrowCount: 0
  },
  {
    id: 6,
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    genre: "Philosophical Fiction",
    year: 1880,
    rating: 4.6,
    isAvailable: true,
    borrowCount: 0
  },
  {
    id: 7,
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    genre: "Psychological Fiction",
    year: 1866,
    rating: 4.7,
    isAvailable: true,
    borrowCount: 0
  },
  {
    id: 8,
    title: "We",
    author: "Yevgeny Zamyatin",
    genre: "Dystopian",
    year: 1924,
    rating: 4.3,
    isAvailable: true,
    borrowCount: 0
  },
  {
    id: 9,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Literary Fiction",
    year: 1951,
    rating: 4.2,
    isAvailable: true,
    borrowCount: 0
  },
  {
    id: 10,
    title: "The Master and Margarita",
    author: "Mikhail Bulgakov",
    genre: "Philosophical Fiction",
    year: 1967,
    rating: 4.7,
    isAvailable: true,
    borrowCount: 0
  }
];

// hardcoded initial users array 
const initialUsers = [
  {
    name: "Mariam",
    borrowedBooks: [], 
    borrowHistory: [],
    penaltyPoints: 0
  },
  {
    name: "Luka",
    borrowedBooks: [],
    borrowHistory: [],
    penaltyPoints: 0
  },
  {
    name: "Nino",
    borrowedBooks: [],
    borrowHistory: [],
    penaltyPoints: 0
  },
  {
    name: "Elene",
    borrowedBooks: [],
    borrowHistory: [],
    penaltyPoints: 0
  },
  {
    name: "Veko",
    borrowedBooks: [],
    borrowHistory: [],
    penaltyPoints: 0
  },
  {
    name: "Tedo",
    borrowedBooks: [],
    borrowHistory: [],
    penaltyPoints: 0
  }
];

// Load from localStorage if present
const storedBooks = localStorage.getItem('books');
const storedUsers = localStorage.getItem('users');

const books = storedBooks ? JSON.parse(storedBooks, reviver) : initialBooks;
const users = storedUsers ? JSON.parse(storedUsers, reviver) : initialUsers;

// If we loaded from localStorage, add any missing new books from initialBooks
if (storedBooks) {
  let addedNewBook = false;
  initialBooks.forEach(book => {
    if (!books.some(b => b.id === book.id)) {
      books.push(book);
      addedNewBook = true;
    }
  });
  if (addedNewBook) {
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Similarly, add missing users from initialUsers if needed
if (storedUsers) {
  let addedNewUser = false;
  initialUsers.forEach(user => {
    if (!users.some(u => u.name === user.name)) {
      users.push(user);
      addedNewUser = true;
    }
  });
  if (addedNewUser) {
    localStorage.setItem('users', JSON.stringify(users));
  }
}

// Save function to call whenever data changes
function saveData() {
  localStorage.setItem('books', JSON.stringify(books));
  localStorage.setItem('users', JSON.stringify(users));
}

// 1.Add book function
function addBook(book) {
  const exists = books.some(b => b.id === book.id);
  if (exists) {
    console.log(`Book with id ${book.id} already exists.`);
    return;
  }
  
  const newBook = {
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    year: book.year,
    rating: book.rating,
    isAvailable: true,
    borrowCount: 0
  };
  
  books.push(newBook);
  saveData();
  console.log(`Book "${newBook.title}" added successfully.`);
}

//2.borrow book functionality (username is case sensetive)
function borrowBook(userName, bookId) {
  const user = users.find(u => u.name === userName);
  if (!user) {
    console.log(`User "${userName}" not found.`);
    return;
  }

  const book = books.find(b => b.id === bookId);
  if (!book) {
    console.log(`Book with id ${bookId} not found.`);
    return;
  }

  if (!book.isAvailable) {
    console.log(`Book "${book.title}" is currently not available.`);
    return;
  }

  book.isAvailable = false;

  const borrowDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(borrowDate.getDate() + 14);

  const borrowEntry = { bookId, borrowDate, dueDate };

  // Save to borrowedBooks
  user.borrowedBooks.push(borrowEntry);

  // Save to borrowHistory
  user.borrowHistory = user.borrowHistory || [];
  user.borrowHistory.push(borrowEntry);

  book.borrowCount++;

  saveData();

  console.log(`Book "${book.title}" successfully borrowed by ${userName}. Due on ${dueDate.toDateString()}.`);
}

//3.return book functionality (username is case sensetive)

function returnBook(userName, bookId) {
  const user = users.find(u => u.name === userName);
  if (!user) {
    console.log(`User "${userName}" not found.`);
    return;
  }

  const book = books.find(b => b.id === bookId);
  if (!book) {
    console.log(`Book with id ${bookId} not found.`);
    return;
  }

  const borrowIndex = user.borrowedBooks.findIndex(b => b.bookId === bookId);
  if (borrowIndex === -1) {
    console.log(`${userName} has not borrowed book "${book.title}".`);
    return;
  }

  const borrowRecord = user.borrowedBooks[borrowIndex];
  const now = new Date();


  user.borrowedBooks.splice(borrowIndex, 1);


  book.isAvailable = true;

  if (now > borrowRecord.dueDate) {
    const lateDays = Math.ceil((now - borrowRecord.dueDate) / (1000 * 60 * 60 * 24));
    user.penaltyPoints += lateDays;
    console.log(`Book "${book.title}" returned late by ${lateDays} day(s). Penalty points added to ${userName}.`);
  } else {
    console.log(`Thank you, ${userName}, for returning "${book.title}" on time!`);
  }

  saveData();
}

//4 search books by (author, genre, rating, year)

function searchBooksBy(param, value) {
  let filteredBooks = [];

  switch (param) {
    case 'author':
      filteredBooks = books.filter(book => book.author.toLowerCase() === value.toLowerCase());
      break;
    
    case 'genre':
      filteredBooks = books.filter(book => book.genre.toLowerCase() === value.toLowerCase());
      break;

    case 'rating':
      filteredBooks = books.filter(book => book.rating >= value);
      break;

    case 'year':
      if (typeof value === 'object') {
        if (value.before !== undefined) {
          filteredBooks = books.filter(book => book.year < value.before);
        } else if (value.after !== undefined) {
          filteredBooks = books.filter(book => book.year > value.after);
        } else {
          console.log('For year, value object must have "before" or "after" key.');
          return [];
        }
      } else {
        console.log('For year filter, value must be an object like { before: 1950 } or { after: 2000 }');
        return [];
      }
      break;

    default:
      console.log(`Unsupported search parameter: ${param}`);
      return [];
  }
  if (filteredBooks.length === 0) {
    console.log(`No books found for "${param}" with value ${JSON.stringify(value)}.`);
  }

  return filteredBooks;
}

// 5. get top rated books function (based on the highest ratings)

function getTopRatedBooks(limit) {
  if (typeof limit !== 'number' || limit <= 0) {
    console.log("Limit must be a positive number.");
    return [];
  }

  const sorted = [...books].sort((a, b) => b.rating - a.rating);
  const topBooks = sorted.slice(0, limit);

  if (topBooks.length === 0) {
    console.log(`No books found.`);
  }

  return topBooks;
}

// 6. get most popular books (based on the most borrowed books)
function getMostPopularBooks(limit) {
  if (typeof limit !== 'number' || limit <= 0) {
    console.log("Limit must be a positive number.");
    return [];
  }

  const sorted = [...books].sort((a, b) => b.borrowCount - a.borrowCount);
  const topBooks = sorted.slice(0, limit);

  if (topBooks.length === 0) {
    console.log(`No books found.`);
  }

  return topBooks;
}

// 7. check overdue users, list of all users who have overdue books.

function checkOverdueUsers() {
  const today = new Date();
  let overdueUsers = [];

  users.forEach(user => {
    const overdueBooks = user.borrowedBooks
      .filter(b => b.dueDate < today)
      .map(b => {
        const daysOverdue = Math.floor((today - b.dueDate) / (1000 * 60 * 60 * 24));
        const book = books.find(book => book.id === b.bookId);
        return {
          bookId: b.bookId,
          title: book ? book.title : 'Unknown',
          daysOverdue
        };
      });

    if (overdueBooks.length > 0) {
      overdueUsers.push({
        userName: user.name,
        overdueBooks
      });
    }
  });

  if (overdueUsers.length === 0) {
    console.log('No users have overdue books.');
  }

  return overdueUsers;
}

//8. recommend books based on  genres the user has borrowed before, books they haven't borrowed yet and sorted by rating (username is case sensetive)
function recommendBooks(userName) {
  const user = users.find(u => u.name === userName);
  if (!user) {
    console.log(`User "${userName}" not found.`);
    return;
  }

  const borrowedBookIds = [
    ...user.borrowedBooks.map(b => b.bookId),
    ...(user.borrowHistory || []).map(b => b.bookId)
  ];

  // 1. Genres from borrow history
  const borrowedGenres = new Set();
  (user.borrowHistory || []).forEach(entry => {
    const book = books.find(b => b.id === entry.bookId);
    if (book) borrowedGenres.add(book.genre.toLowerCase());
  });

  // 1. Recommended by borrowed genres
  const genreBased = books.filter(book =>
    !borrowedBookIds.includes(book.id) &&
    borrowedGenres.has(book.genre.toLowerCase())
  ).sort((a, b) => b.rating - a.rating);

  // 2. Books not borrowed ever
  const notBorrowed = books.filter(book =>
    !borrowedBookIds.includes(book.id)
  ).sort((a, b) => b.rating - a.rating).slice(0,5);

  // 3. Top-rated books overall (not filtered by unread)
  const topRated = [...books]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // Output
  console.log(`Recommended books for ${userName}:\n`);

  console.log("1. Recommended by borrowed genres:");
  if (genreBased.length === 0) {
    console.log("  No recommendations based on genre.");
  } else {
    genreBased.forEach(book => {
      console.log(`  - ${book.title} (${book.genre}) — Rating: ${book.rating}`);
    });
  }

  console.log("\n2. Books you haven't borrowed yet:");
  if (notBorrowed.length === 0) {
    console.log("  You have borrowed all available books.");
  } else {
    notBorrowed.forEach(book => {
      console.log(`  - ${book.title} (${book.genre}) — Rating: ${book.rating}`);
    });
  }

  console.log("\n3. Top-rated books overall:");
  if (topRated.length === 0) {
    console.log("  No books available.");
  } else {
    topRated.forEach(book => {
      console.log(`  - ${book.title} — Rating: ${book.rating}`);
    });
  }
}

//9 remove book function by book Id

function removeBook(bookId) {
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex === -1) {
    console.log(`Book with id ${bookId} not found.`);
    return;
  }

  const book = books[bookIndex];
  if (!book.isAvailable) {
    console.log(`Cannot remove "${book.title}" because it is currently borrowed.`);
    return;
  }

  books.splice(bookIndex, 1);
  saveData();
  console.log(`Book "${book.title}" removed successfully.`);
}

//10 user info function: list of currently borrowed books, overdue items, penalty points
function printUserSummary(userName) {
  const user = users.find(u => u.name === userName);
  if (!user) {
    console.log(`User "${userName}" not found.`);
    return;
  }

  const now = new Date();

  console.log(`Summary for ${userName}:\n`);

  if (user.borrowedBooks.length === 0) {
    console.log("No books currently borrowed.");
  } else {
    console.log("Currently borrowed books:");
    user.borrowedBooks.forEach(({ bookId, dueDate }) => {
      const book = books.find(b => b.id === bookId);
      console.log(`- ${book.title} (Due: ${dueDate.toDateString()})`);
    });

    // Overdue items
    const overdueItems = user.borrowedBooks.filter(({ dueDate }) => dueDate < now);
    if (overdueItems.length > 0) {
      console.log("\nOverdue items:");
      overdueItems.forEach(({ bookId, dueDate }) => {
        const book = books.find(b => b.id === bookId);
        const overdueDays = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
        console.log(`- ${book.title} (Overdue by ${overdueDays} day(s))`);
      });
    } else {
      console.log("\nNo overdue items.");
    }
  }

  console.log(`\nTotal penalty points: ${user.penaltyPoints}`);
}

