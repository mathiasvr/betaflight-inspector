<script>
  export let variable
  const data = variable
  const key = data.name

  // TODO: create `newValue` and bind it, instead of manually updating DOM (for show)
</script>

<div class="row {data.value !== data.default ? 'nondefault' : ''}">
  <div class="col-3 my-1 text-monospace text-break">{key}</div>
  
  <div class="col my-1">
    {#if data.range}
      {#if Math.abs(data.range[1] - data.range[0]) <= 10000}
      <input id="{key}__opt" type="range" min={data.range[0]} max={data.range[1]} value={data.value} oninput="{key}__displ2.value = this.value"/>
      {/if}
        <!--output id="{key}__displ">{data.value}</output-->
      <input type="number" id="{key}__displ2" min={data.range[0]} max={data.range[1]} value={data.value}/>
      {#if data.unit}<i>{data.unit}</i>{/if}
    {:else if data.allowed}
      {#if data.allowed.length === 2 && data.allowed.includes('ON') && data.allowed.includes('OFF')}
      <input id="{key}__opt" type="checkbox" checked={data.value === 'ON'}/>
      {:else}
      <select id="{key}__opt">
        {#each data.allowed as option}
        <option value={option} selected={option === data.value}>{option}</option>
        {/each}
      </select>
      {/if}
    {:else}
    <!-- TODO: use data.value thing instead of default (also assume/assert no default in this chain) -->
    <!-- TODO: clean up '-' values to empty string -->
    <!-- TODO: add placeholder="RATE_1", etc.-->
    <input id="{key}__opt" type="text" value="{data.value}"/>
    {/if}
  </div>
  
  <!-- TODO: fix buttons, don't use "close" labels, etc. -->
  <div class="col my-1">
    {#if data.desc}
    <button type="button" class="" aria-label="Close" data-toggle="tooltip" data-html="true" data-placement="left"
            title="{data.aka ? data.desc + `<br><i>BFC Name: <b>${data.aka}</b></i>` : data.desc}">
      <i class="fas fa-question-circle" aria-hidden="true"></i>
    </button>
    {/if}
    <!-- <button type="button" class="" aria-label="Close" title="Reset to default value"><i class="fas fa-undo-alt" aria-hidden="true"></i></button>
    <button type="button" class="" aria-label="Close" title="Report issue"><i class="fas fa-exclamation-circle" aria-hidden="true"></i></button>
    <button type="button" class="" aria-label="Close" title="Connect"><i class="fas fa-exchange-alt" aria-hidden="true"></i></button> -->
  </div>

  <div class="description col-12 font-weight-light">
  {#if data.desc}{data.desc}{/if}
  </div>

</div>

<style>
  .row:nth-child(odd) {
    background-color: #f4f4f4;
  }
  .row.nondefault {
    background-color: #b5ffd4;
  }
  .description {
    display: none;
  }
</style>
