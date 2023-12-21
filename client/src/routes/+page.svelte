<script>
    import FeedBookCard from "../lib/feedBookCard.svelte";

    export let data;

    /**
     * Handles searches on the home page search bar.
     * @param {Event} e - Default event.
     */
    function searchBarHandler(e) {
        if (e.key === "Enter") {
            const searchType = document.getElementById("search-bar-options").value;
            const searchValue = document.getElementById("search-bar-home").value.trim();

            if (searchType === "" || searchValue === "") {
                return;
            }

            if (searchType === "user") {
                redirectToUserProfile(searchValue);
            } else {
                redirectToSearchPage(searchType, searchValue);
            }
        }
    }

    /**
     * Redirects user to search page with the correct URL parameters.
     * @param {string} searchType
     * @param {string} searchValue
     */
    function redirectToSearchPage(searchType, searchValue) {
        window.location.href = `/search?${searchType}=${searchValue}`;
    }

    /**
     * Redirects user to a giver user's profile.
     * @param {string} username
     */
    function redirectToUserProfile(username) {
        window.location.href = `/user/${username}`;
    }
</script>

<main class="border-dark-400 bg-dark-500 border md:mx-[20vw] rounded shadow-md mb-6">
    <div id="search-bar-container">
        <select id="search-bar-options">
            <option value=""> Search type </option>
            <option value="genre"> Book genre </option>
            <option value="title"> Book title </option>
            <option value="user"> Username </option>
        </select>

        <input type="search" id="search-bar-home" on:keydown={searchBarHandler} />
    </div>

    <div id="banner-container">
        <img src="/home_banner.png" alt="Banner My Book List" />
    </div>

    <div id="top-10-books">
        <h2 class="text-lg md:text-xl font-bold py-4 px-6">
            Top rated books
        </h2>

        <div id="top-books-container" class="w-full h-full bg-dark-600 py-8">
            {#each data.feed as book, i}
                <FeedBookCard rank={i+1} {...book}/>
            {/each}
        </div>
    </div>
</main>