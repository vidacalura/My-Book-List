<script>
    import SearchPageBookCard from '../../lib/searchPageBookCard.svelte';

    export let data;

    /**
     * Searches for a book based on the user's input on the search bar.
     * @param {Event} e - Default event
     */
    function searchBook(e) {
        if (e.key == null || e.key === "Enter") {
            const urlParams = new URLSearchParams(window.location.search);

            const searchType = (
                urlParams.get("title") != null 
                ? "title"
                : "genre");
            const searchValue = document.getElementById("main-search-bar").value.trim();

            window.location.href = `/search?${searchType}=${searchValue}`;
        }
    }
</script>

<main class="border-dark-400 bg-dark-500 border md:mx-[20vw] rounded shadow-md mb-6">
    <h2 class="text-lg md:text-xl font-bold py-4 px-6">
        Book Search
    </h2>
    <div class="w-full h-full flex justify-center bg-dark-600 py-12">
        <div class="border flex border-dark-300 rounded-lg">
            <input type="text" id="main-search-bar" on:keydown={searchBook} />
            <button id="search-icon-btn" on:click={searchBook}> S </button>
        </div>
    </div>

    <h3 class="md:text-lg font-bold py-4 px-6">
        Search Results
    </h3>
    <div id="search-results-container">
        <div class="search-page-title">
            <div class="w-[42%]">
                <p> Title </p>
            </div>
            <div class="w-[42%]">
                <p> Writer(s) </p>
            </div>
            <div class="w-[8%]">
                <p> Score </p>
            </div>
            <div class="w-[8%]">
                <p> Add to list</p>
            </div>
        </div>

        <div class="border border-dark-400 mx-3">
        {#if data.books != null}
            {#each data.books as book, i}
                <SearchPageBookCard 
                    cardClass={(i % 2 == 0 ? "search-page-book-card-dark" : "search-page-book-card-light")} 
                    {...book}
                />
            {/each}
        {:else}
            <p class="text-xl font-bold py-6"> Book(s) not found </p>
        {/if}
        </div>
    </div>
</main>