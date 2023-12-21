export async function load({ fetch, params }) {
    const feed = await fetchHomeFeed(fetch);

    return { feed: feed.feed };
}

/**
 * Fetches the top 10 most well avaliated books on the system.
 * @param {function} fetch - Fetcher from sveltekit.
 * @returns {Array|null} - Feed with top 10 books.
 */
async function fetchHomeFeed(fetch) {
    return await fetch("http://localhost:4000/api/books/feed")
    .then((res) => { return res.json(); })
    .catch((err) => {
        console.log(err);
        return null;
    });
}