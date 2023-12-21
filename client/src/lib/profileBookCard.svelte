<script>
    export let pos, title, writer, score, genre, chapters, chaptersRead, bookState;

    const borderClass = (() => {
        if (bookState === 0) 
            return "plan-to-read";
        if (bookState === 1)
            return "reading";
        if (bookState === 2)
            return "read";

        return "dropped";
    })();
</script>

<div class="profile-book-card {borderClass}">
    <p class="w-[10%] text-center"> {pos} </p>
    <p class="w-[30%] px-4 text-sm font-bold"> {title} </p>
    <p class="w-[30%] px-4 text-sm"> {writer} </p>
    <p class="w-[9%] text-center"> {score} </p>
    <p class="w-[10%] px-4 text-center text-sm"> {genre} </p>
    <p class="w-[10%] text-center"> {chaptersRead} / {chapters} </p>
</div>