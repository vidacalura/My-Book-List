export async function load({ fetch, params, url }) {
    const [searchType, searchValue] = getURLSearchParams(url);
    const books = await fetchBooks(fetch, searchType, searchValue);

    return { books: books.books };
}

/**
 * Gets the URL parameters for the search.
 * @param {object} url - URL object from sveltekit.
 * @returns {Array} - An array of 2 strings: search type and value.
 */
function getURLSearchParams(url) {
    let arr = ["", ""];
    if (url.searchParams.get("title") != null) {
        arr[0] = "search";
        arr[1] = url.searchParams.get("title");
    } else {
        arr[0] = "genre";
        arr[1] = url.searchParams.get("genre");
    }

    return arr;
}

/**
 * Fetches books by either title or genre.
 * @param {object} fetch - Fetcher from sveltekit.
 * @param {string} searchType - Type of search. Title or genre.
 * @param {string} searchValue - Value to be searched.
 * @returns {Array|null} - Books corresponding to the search.
 */
async function fetchBooks(fetch, searchType, searchValue) {
    return await fetch(`http://localhost:4000/api/books/${searchType}/${searchValue}`)
    .then((res) => { return res.json(); })
    .catch((err) => {
        console.log(err);
        return null;
    });
}