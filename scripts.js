import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Created a custom web component
class BookConnect extends HTTMLElement { //web component created
    // Initialises HTMLElement 
    constructor() {
        super();
        // Encapsulates styles and markup and allows DOM to be accessible through JavaScript
        this.attachShadow({mode: 'open'});
        this.page = 1;
        this.matches = books;
        this.shadowRoot.innerHTML =``;
        // Calls methods
        this.renderBooks(this.matches);
        this.updateShowMoreButton();
        this.attachEventListeners();

    }


/**
 * 
 * @param {*} book 
 * @returns 
 */

// Iterates through matches and creates preview elements for first page
   createPreviewButton(book) {
 const { id, image, title, author } = book;
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);
    element.innerHTML = `
        <img class="preview__image" src="${image}"/>
        <div class="preview__info"><h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
        </div>
    `;

  return element;
}

/**
 * 
 * @param {*} bookList 
 */

renderBooks(bookList) {
    const fragment = document.createDocumentFragment();
    bookList.slice(0, BOOKS_PER_PAGE).forEach(book => {
        const element = createPreviewButton(book);
        fragment.appendChild(element);
        authorsOption();
        createGenreOption();
    });

// // Appends initial previews to the document
this.shadowRoot.querySelector('[data-list-items]').innerHTML = '';
this.shadowRoot.querySelector('[data-list-items]').appendChild(fragment);

}

updateShowMoreButton() {
    const remaining = Math.max(matches.length - (page * BOOKS_PER_PAGE), 0);
    const button = this.shadowRoot.querySelector('[data-list-button]');
    button.innerText = `Show more (${remaining})`;
    button.disabled = remaining <= 0;
}


authorsOption() {
    const authorsHtml = document.createDocumentFragment()
    const firstAuthorElement = createOptionElement('any', "All Authors");
    authorsHtml.appendChild(firstAuthorElement);

    for (const [id, name] of Object.entries(authors)) {
        authorsHtml.appendChild(createOptionElement(id, name));
    }
    this.shadowRoot.querySelector('[data-search-authors]').appendChild(authorsHtml);
}

createGenreOption() {
    const genreHtml = document.createDocumentFragment()
    const firstGenreElement = this.createOptionElement('any', "All Genres");
    genreHtml.appendChild(firstGenreElement);

    for (const [id, name] of Object.entries(genres)) {
        genreHtml.appendChild(createOptionElement(id, name));
}
this.shadowRoot.querySelector('[data-search-genres]').appendChild(genreHtml);
}

/**
 * 
 * @param {*} value 
 * @param {*} name 
 * @returns 
 */

 createOptionElement(value, name) {
    const element = document.createElement('option');
    element.value = value;
    element.innerText = name;
    return element
}

/**
 * 
 * @param {*} filters 
 */

handleBookSearch(filters) {
    const result = books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        return (
            (filters.title.trim() === '' || book.title.toLocaleLowerCase().includes(filters.title.toLowerCase())) &&
            (filters.author === 'any' || book.author === filters.author) &&
        genreMatch
    );
});


// resets to first page
this.page = 1;
this.matches = result;
this.renderBooks(this.matches);
this.updateShowMoreButton();
}

attachEventListeners() {
// Adds event listener to show setting overlay when search icon is clicked
this.shadowRoot.querySelector('[data-header-search]').addEventListener('click', () => {
    this.shadowRoot.querySelector('[data-search-overlay]').open = true 
    this.shadowRoot.querySelector('[data-search-title]').focus()
})

this.shadowRoot.querySelector('[data-search-form]').addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    handleBookSearch(filters);
    this.shadowRoot.querySelector('[data-search-overlay]').open = false;
});

// Adds event listeners to hide search overlay when cancel button is clicked
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
})

// Adding event listener to show settings overlay when settings icon is clicked.
this.shadowRoot.querySelector('[data-header-settings]').addEventListener('click', () => {
    this.shadowRoot.querySelector('[data-settings-overlay]').open = true 
})

// Event listener to handle theme change submission
this.shadowRoot.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData.entries());
    
    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    // Close settings overlay after theme change
    this.shadowRoot.querySelector('[data-settings-overlay]').open = false;
});

// Set cancel button to false for setting icon
this.shadowRoot.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    this.shadowRoot.querySelector('[data-settings-overlay]').open = false
})


this.shadowRoot.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment();
    mthis.atches.slice(page * BOOKS_PER_PAGE, (this.page + 1) * BOOKS_PER_PAGE).forEach(book => {
        const element = this.createPreviewButton(book);
        fragment.appendChild(element);
    });
    this.shadowRoot.querySelector('[data-list-items]').appendChild(fragment);
    this.page += 1;
    this.updateShowMoreButton()
});

// // Adding event listener to hide book details overlay when close button is clicked.
this.shadowRoot.querySelector('[data-list-close]').addEventListener('click', () => {
    this.shadowRoot.querySelector('[data-list-active]').open = false
})


this.shadowRoot.querySelector('[data-list-items]').addEventListener('click', event => {
    const previewButton = event.target.closest('[data-preview]');
    if (!previewButton) return;
    const activeBook = matches.find(book => book.id === previewButton.dataset.preview);
    if(activeBook) {
        this.shadowRoot.querySelector('[data-list-active]').open = true
        this.shadowRoot.querySelector('[data-list-blur]').src = activeBook.image
        this.shadowRoot.querySelector('[data-list-image]').src = activeBook.image
        this.shadowRoot.querySelector('[data-list-title]').innerText = activeBook.title
        this.shadowRoot.querySelector('[data-list-subtitle]').innerText = `${authors[activeBook.author]} (${new Date(activeBook.published).getFullYear()})`
        this.shadowRoot.querySelector('[data-list-description]').innerText = activeBook.description
    }
});
}
connectedCallback() {
    this.renderBooks(this.matches);
    this.updateShowMoreButton();
    this.authorsOption();
    this.createGenreOption();
 }
}
// Registers the custom element
customElements.define('book-connect', BookConnect);



