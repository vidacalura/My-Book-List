<script>
    import ProfileBookCard from "../../../lib/profileBookCard.svelte";

    export let data;
</script>

<main>
    {#if data.user != null}
        <div class="border border-dark-400 lg:mx-[20vw] py-6">
            <div class="flex justify-center py-24 text-xl">
                <h4> Viewing <b>{data.user.username}</b>'s Book List </h4>
            </div>

            <div id="book-state-filter-div">
                <a href="/user/{data.user.username}"> <p> All Books </p> </a>
                <a href="/user/{data.user.username}?bookState=0"> <p> Plan to read </p> </a>
                <a href="/user/{data.user.username}?bookState=1"> <p> Reading </p> </a>
                <a href="/user/{data.user.username}?bookState=2"> <p> Completed </p> </a>
                <a href="/user/{data.user.username}?bookState=3"> <p> Dropped </p> </a>
            </div>

            <div>
                <!-- Book list title -->
                <div class="bg-blue-600 w-[98%] text-center text-dark-500 font-bold text-xl py-1 mt-6 mx-[1%]">
                    <h3> ALL BOOKS </h3>
                </div>

                <!-- Book list captions -->
                <div class="flex text-center pl-2 bg-dark-500 w-[98%] mx-[1%] py-2 border-b border-dark-400">
                    <p class="w-[10%]"> # </p>
                    <p class="w-[30%]"> Book title </p>
                    <p class="w-[30%]"> Writer(s) </p>
                    <p class="w-[9%]"> Score </p>
                    <p class="w-[10%]"> Genre </p>
                    <p class="w-[10%]"> Progress </p>
                </div>

                <!-- Book list -->
                <div>
                    {#each data.user.registers as reg, i}
                        <ProfileBookCard
                            pos={i+1}
                            title={reg.bookInfo.title}
                            writer={reg.bookInfo.writer} 
                            score={reg.score}
                            genre={reg.bookInfo.genre}
                            chapters={reg.bookInfo.chapters}
                            chaptersRead={reg.chaptersRead}
                            bookState={reg.bookState}
                        />
                    {/each}
                </div>
            </div>
        </div>
    {:else}
        <p> User not found. </p>
    {/if}
</main>