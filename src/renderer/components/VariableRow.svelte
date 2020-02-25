<script>
  export let key
  export let data

  // TODO: fix
  if (typeof data === 'string') {
    data = { default: data }
  }
</script>


<div class="row">
  <div class="col-3 my-1 text-monospace text-break">{key}</div>
  
  <div class="col my-1">
    {#if data.range}
    <input id="{key}__opt" type="range" min={data.range[0]} max={data.range[1]} value={data.default} oninput="{key}__displ2.value = this.value"/>
      <!--output id="{key}__displ">{data.default}</output-->
    <input type="number" id="{key}__displ2" min={data.range[0]} max={data.range[1]} value={data.default}/>
    <span>{data.unit || ''}</span>
    {:else if data.allowed}
      {#if data.allowed.length === 2 && data.allowed.includes('ON') && data.allowed.includes('OFF')}
      <input id="{key}__opt" type="checkbox" checked={data.default === 'ON'}/>
      {:else}
      <select id="{key}__opt">
        {#each data.allowed as option}
        <option value={option} selected={option === data.default}>{option}</option>
        {/each}
      </select>
      {/if}
    {:else}
    <!-- TODO: use data.value thing instead of default (also assume/assert no default in this chain) -->
    <!-- TODO: clean up '-' values to empty string -->
    <!-- TODO: add placeholder="RATE_1", etc.-->
    <input id="{key}__opt" type="text" value="{data.default}"/>
    {/if}
  </div>

  
  <!-- TODO: fix buttons, don't use "close" labels, etc. -->
  <div class="col my-1">
    {#if data.desc}
    <button type="button" class="" aria-label="Close" data-toggle="tooltip" data-html="true" data-placement="left" title="{data.desc}">
      <i class="fas fa-question-circle" aria-hidden="true"></i>
    </button>
    {/if}
    <button type="button" class="" aria-label="Close" title="Reset to default value"><i class="fas fa-undo-alt" aria-hidden="true"></i></button>
    <button type="button" class="" aria-label="Close" title="Report issue"><i class="fas fa-exclamation-circle" aria-hidden="true"></i></button>
    <button type="button" class="" aria-label="Close" title="Connect"><i class="fas fa-exchange-alt" aria-hidden="true"></i></button>
  </div>

</div>


<style>
  .row:nth-child(odd) {
    background-color: #f4f4f4;
  }
</style>
