<script>
    export let cardClass, title, writer, avgScore;
</script>

<div class={cardClass}>
    <div class="title-search font-bold text-lg py-4">
        <h3> {title} </h3>
    </div>
    <div class="writer-search py-4">
        <p> {writer} </p>
    </div>
    <div class="avg-score-search">
        <h4> {avgScore.toFixed(2)} </h4>
    </div>
    <div class="btns-search">
        <button> + </button>
    </div>
</div>