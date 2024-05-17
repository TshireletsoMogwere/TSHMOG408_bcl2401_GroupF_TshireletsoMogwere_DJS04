import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Created a custom web component
class BookConnect extends HTMLElement { //web component created
    // Initialises HTMLElement 
    constructor() {
        super();
        // Encapsulates styles and markup and allows DOM to be accessible through JavaScript
        this.attachShadow({mode: 'open'});
        this.page = 1;
        this.matches = books;
        this.shadowRoot.innerHTML =`
        <style>
        :root {
            --color-blue: 0, 150, 255;
            --color-force-dark: 10, 10, 20;
            --color-force-light: 255, 255, 255;
            --color-dark: 10, 10, 20;
            --color-light: 255, 255, 255;
          }
          
          @media (prefers-color-scheme: dark) {
            :root {
              --color-dark:  255, 255, 255; 
              --color-light: 10, 10, 20;
            }
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            min-height: 100vh;
            min-width: 100%;
            font-family: Roboto, sans-serif;
            color: rgba(var(--color-dark), 0.9);
            background: linear-gradient(0deg, rgba(var(--color-dark), 0.2), rgba(var(--color-dark), 0.1)), rgba(var(--color-light), 1);
          }
          
          option {
            background-color: rgba(var(--color-light), 1);
            color: rgba(var(--color-dark), 0.8);
          }
          
          @keyframes enter {
            from {
              transform: translateY(10rem);
            }
            to {
              transform: translateY(0);
            }
          }
          
          /* header */
          
          .header {
            background-color: rgba(var(--color-force-dark), 0.9);
            position: sticky;
            top: 0;
            left: 0;
          }
          
          .header__inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            max-width: 70rem;
            padding: 0 1rem;
            margin: 0 auto;
          }
          
          .header__logo {
            padding: 1.5rem 0 1.5rem 0.5rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }
          
          .header__shape {
            height: 1rem;
            margin-right: 0.75rem;
            fill: rgb(var(--color-blue));
            display: none;
          }
          
          @media (min-width: 30rem) {
            .header__shape {
              display: block;
            }
          }
          
          .header__text {
            height: 1rem;
            fill: rgba(var(--color-force-light), 1);
          }
          
          @media (min-width: 30rem) {
            .header__text {
              height: 1.25rem;
              fill: rgba(var(--color-force-light), 1);
            }
          }
          
          .header__icon {
            width: 1.5rem;
            height: 1.5rem;
            fill: rgba(var(--color-force-light), 1);
          }
          
          .header__button {
            background-color: rgba(var(--color-force-light), 0.1);
            transition: background-color 0.1s;
            border-width: 0;
            border-radius: 6px;
            height: 2.5rem;
            width: 2.5rem;
            cursor: pointer;
            margin-right: 0.25rem;
          }
          
          .header__button:hover {
            background-color: rgba(var(--color-force-light), 0.2);
          }
          
          .header__button:active {
            background-color: rgba(var(--color-force-light), 0.3);
          }
          
          /* grid */
          
          .list {
            padding-bottom: 10rem;
          }
          
          .list__message {
            display: none;
            padding: 10rem 4rem 2rem;
            text-align: center;
          }
          
          .list__message_show {
            display: block;
          }
          
          .list__items {
            display: grid;
            padding: 2rem 1rem;
            grid-template-columns: 1fr;
            grid-column-gap: 0.5rem;
            grid-row-gap: 0.5rem;
            margin: 0 auto;
            width: 100%;
          }
          
          @media (min-width: 50rem) {
            .list__items {
              grid-template-columns: repeat(2, 1fr);
              grid-column-gap: 0.75rem;
              grid-row-gap: 0.75rem;
            }
          }
          
          @media (min-width: 100rem) {
            .list__items {
              grid-template-columns: repeat(4, 1fr);
              grid-column-gap: 0.75rem;
              grid-row-gap: 0.75rem;
            }
          }
          
          @media (min-width: 150rem) {
            .list__items {
              grid-template-columns: repeat(8, 1fr);
              grid-column-gap: 0.75rem;
              grid-row-gap: 0.75rem;
            }
          }
          
          .list__button {
            font-family: Roboto, sans-serif;
            transition: background-color 0.1s;
            border-width: 0;
            border-radius: 6px;
            height: 2.75rem;
            cursor: pointer;
            width: 50%;
            background-color: rgba(var(--color-blue), 1);
            color: rgba(var(--color-force-light), 1);
            font-size: 1rem;
            border: 1px solid rgba(var(--color-blue), 1);
            max-width: 10rem;
            margin: 0 auto;
            display: block;
          }
          
          .list__remaining {
            opacity: 0.5;
          }
          
          .list__button:not(:disabled) hover {
            background-color: rgba(var(--color-blue), 0.8);
            color: rgba(var(--color-force-light), 1);
          }
          
          .list__button:disabled {
            cursor: not-allowed;
            opacity: 0.2;
          }
          
          /* preview */
          
          .preview {
            border-width: 0;
            width: 100%;
            margin: 10px;
            font-family: Roboto, sans-serif;
            padding: 0.5rem 1rem;
            display: flex;
            align-items: center;
            cursor: pointer;
            text-align: left;
            border-radius: 8px;
            border: 1px solid rgba(var(--color-dark), 0.15);
            background: rgba(var(--color-light), 1);
          }
          
          @media (min-width: 60rem) {
            .preview {
              padding: 1rem;
            }
          }
          
          .preview_hidden {
            display: none;
          }
          
          .preview:hover {
            background: rgba(var(--color-blue), 0.05);
          }
          
          .preview__image {
            width: 48px;
            height: 70px;
            object-fit: cover;
            background: grey;
            border-radius: 2px;
            box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
              0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
          }
          
          .preview__info {
            padding: 1rem;
          }
          
          .preview__title {
            margin: 0 0 0.5rem;
            font-weight: bold;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
            color: rgba(var(--color-dark), 0.8)
          }
          
          .preview__author {
            color: rgba(var(--color-dark), 0.4);
          }
          
          /* overlay */
          
          .overlay {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            border-width: 0;
            box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
            animation-name: enter;
            animation-duration: 0.6s;
            z-index: 10;
            background-color: rgba(var(--color-light), 1);
          }
          
          @media (min-width: 30rem) {
            .overlay {
              max-width: 30rem;
              left: 0%;
              top: 0;
              border-radius: 8px;;
            }
          }
          
          .overlay__form {
            padding-bottom: 0.5rem;
            margin: 0 auto;
          }
          
          .overlay__row {
            display: flex;
            gap: 0.5rem;
            margin: 0 auto;
            justify-content: center;
          }
          
          .overlay__button {
            font-family: Roboto, sans-serif;
            background-color: rgba(var(--color-blue), 0.1);
            transition: background-color 0.1s;
            border-width: 0;
            border-radius: 6px;
            height: 2.75rem;
            cursor: pointer;
            width: 50%;
            color: rgba(var(--color-blue), 1);
            font-size: 1rem;
            border: 1px solid rgba(var(--color-blue), 1);
          }
          
          .overlay__button_primary {
            background-color: rgba(var(--color-blue), 1);
            color: rgba(var(--color-force-light), 1);
          }
          
          .overlay__button:hover {
            background-color: rgba(var((var(--color-blue))), 0.2);
          }
          
          
          .overlay__button_primary:hover {
            background-color: rgba(var(--color-blue), 0.8);
            color: rgba(var(--color-force-light), 1);
          }
          
          .overlay__input {
            width: 100%;
            margin-bottom: 0.5rem;
            background-color: rgba(var(--color-dark), 0.05);
            border-width: 0;
            border-radius: 6px;
            width: 100%;
            height: 4rem;
            color: rgba(var(--color-dark), 1);
            padding: 1rem 0.5rem 0 0.75rem;
            font-size: 1.1rem;
            font-weight: bold;
            font-family: Roboto, sans-serif;
            cursor: pointer;
          }
          
          .overlay__input_select {
            padding-left: 0.5rem;
          }
          
          .overlay__field {
            position: relative;
            display: block;
          }
          
          .overlay__label {
            position: absolute;
            top: 0.75rem;
            left: 0.75rem;
            font-size: 0.85rem;
            color: rgba(var(--color-dark), 0.4);
          }
          
          .overlay__input:hover {
            background-color: rgba(var(--color-dark), 0.1);
          }
          
          .overlay__title {
            padding: 1rem 0 0.25rem;
            font-size: 1.25rem;
            font-weight: bold;
            line-height: 1;
            letter-spacing: -0.1px;
            max-width: 25rem;
            margin: 0 auto;
            color: rgba(var(--color-dark), 0.8)
          }
          
          .overlay__blur {
            width: 100%;
            height: 200px;
            filter: blur(10px);
            opacity: 0.5;
            transform: scale(2);
          }
          
          .overlay__image {
            max-width: 10rem;
            position: absolute;
            top: 1.5m;
            left: calc(50% - 5rem);
            border-radius: 2px;
            box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
          }
          
          .overlay__data {
            font-size: 0.9rem;
            display: -webkit-box;
            -webkit-line-clamp: 6;
            -webkit-box-orient: vertical;  
            overflow: hidden;
            color: rgba(var(--color-dark), 0.8)
          }
          
          .overlay__data_secondary {
            color: rgba(var(--color-dark), 0.6)
          }
          
          .overlay__content {
            padding: 2rem 1.5rem;
            text-align: center;
            padding-top: 3rem;
          }
          
          .overlay__preview {
            overflow: hidden;
            margin: -1rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .overlay__background {
            background: rgba(var(--color-dark), 0.6);
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
          }
          
          /* backdrop */
          
          .backdrop {
            display: none;
            background: rgba(var(--color-dark), 0.3);
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
          }
          
          .overlay[open] ~ .backdrop {
            display: block;
          }
          
        </style>
        <div>
        <div data-search-overlay></div>
         <div data-settings-overlay></div>
        <div><div data-list-items></div>
        <div data-list-active>
            <img data-list-blur>
            <img data-list-image>
            <h3 data-list-title></h3>
            <p data-list-subtitle></p>
            <p data-list-description></p>
            
        </div>
    </div>`;

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
        const element = this.createPreviewButton(book);
        fragment.appendChild(element);
    });

// // Appends initial previews to the document
this.shadowRoot.querySelector('[data-list-items]').innerHTML = '';
this.shadowRoot.querySelector('[data-list-items]').appendChild(fragment);

}

updateShowMoreButton() {
    const remaining = Math.max(this.matches.length - (this.page * BOOKS_PER_PAGE), 0);
    const button = this.shadowRoot.querySelector('[data-list-button]');
    button.innerText = `Show more (${remaining})`;
    button.disabled = remaining <= 0;
}


authorsOption() {
    const authorsHtml = document.createDocumentFragment()
    const firstAuthorElement = this.createOptionElement('any', "All Authors");
    authorsHtml.appendChild(firstAuthorElement);

    for (const [id, name] of Object.entries(authors)) {
        authorsHtml.appendChild(this.createOptionElement(id, name));
    }
    this.shadowRoot.querySelector('[data-search-authors]').appendChild(authorsHtml);
}

createGenreOption() {
    const genreHtml = document.createDocumentFragment()
    const firstGenreElement = this.createOptionElement('any', "All Genres");
    genreHtml.appendChild(firstGenreElement);

    for (const [id, name] of Object.entries(genres)) {
        genreHtml.appendChild(this.createOptionElement(id, name));
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
    this.handleBookSearch(filters);
    this.shadowRoot.querySelector('[data-search-overlay]').open = false;
});

// Adds event listeners to hide search overlay when cancel button is clicked
this.shadowRoot.querySelector('[data-search-cancel]').addEventListener('click', () => {
    this.shadowRoot.querySelector('[data-search-overlay]').open = false
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
    this.matches.slice(this.page * BOOKS_PER_PAGE, (this.page + 1) * BOOKS_PER_PAGE).forEach(book => {
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
});


this.shadowRoot.querySelector('[data-list-items]').addEventListener('click', event => {
    const previewButton = event.target.closest('[data-preview]');
    if (!previewButton) return;
    const activeBook = this.matches.find(book => book.id === previewButton.dataset.preview);
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
    this.attachEventListeners();
 }
}
// Registers the custom element
customElements.define('book-connect', BookConnect);



