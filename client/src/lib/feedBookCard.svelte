<script>
    export let rank, title, writer, avgScore;
</script>

<div class="feed-book-card">
    <p class="font-bold text-gray-300 text-xl md:text-2xl">
        {rank}
    </p>
    <h3 class="font-bold text-sm md:text-lg w-[40%]">
        {title}
    </h3>
    <h4 class="font-bold text-[#CCC] text-xs md:text-sm w-[30%] pt-1">
        {writer}
    </h4>
    <h3 class="font-bold pt-1">
        {avgScore.toFixed(2)}
    </h3> 
</div>