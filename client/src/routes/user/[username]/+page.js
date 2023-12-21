export async function load({ fetch, params, url }) {
    const res = await fetchUserProfile(fetch, params.username);

    return { user: res.user };
}

/**
 * Fetches the user's profile from the API.
 * @param {function} fetch - Fetcher from sveltekit.
 * @param {string} username - User to be fetched.
 * @returns {Array|null} - User's profile data.
 */
async function fetchUserProfile(fetch, username) {
    return await fetch(`http://localhost:4000/api/users/profile/${username}`)
    .then((res) => { return res.json(); })
    .catch((err) => {
        console.log(err);
        return null;
    });
}