<script>
  // import SvgInfo from 'bootstrap-icons/icons/question-square-fill.svg'
  import SvgInfo from 'bootstrap-icons/icons/info-square.svg'
  import SvgUndo from 'bootstrap-icons/icons/arrow-counterclockwise.svg'
  import OSDPosition from './osdPosition.svelte'

  export let variable
  // copy of variable (bound to user changes)
  $: data = variable
  // TODO: key may not be needed for id's
  $: key = data.name
</script>

<!-- TODO: fix types for comparison  -->
<div class="row">
  <div class="col my-1 pr-0 text-monospace font-weight-bold" style="max-width:0;color:#0062cc;">
    {data.value.toString() !== data.default.toString() ? '*' : ''}
  </div>
  <div class="col-4 my-1 text-monospace text-break">{data.name}</div>

  <div class="col my-1">
    {#if data.range}
      {#if Math.abs(data.range[1] - data.range[0]) <= 10000}
      <input class="custom-range" id="{key}__opt" type="range" min={data.range[0]} max={data.range[1]} bind:value={data.value}/>
      {/if}
        <!--output id="{key}__displ">{data.value}</output-->
      <div class="form-row align-items-center">
        <div class="col">
          <input class="form-control" type="number" id="{key}__displ2" min={data.range[0]} max={data.range[1]} bind:value={data.value}/>
        </div>
        {#if data.unit}<i>{data.unit}</i>{/if}
      </div>

      {#if data.name.startsWith('osd_') && data.name.endsWith('_pos') && data.range[1] === 0x3BFF}
        <OSDPosition value={data.value} />
      {/if}

    {:else if data.allowed}
      <!-- TODO: make this type boolean before-hand for easier binding? -->
      {#if data.allowed.length === 2 && data.allowed.includes('ON') && data.allowed.includes('OFF')}
      <div class="custom-control custom-switch">
        <input class="custom-control-input" id="{key}__opt" type="checkbox" checked={data.value === 'ON'} on:change={data.value = this.checked ? 'ON' : 'OFF' } />
        <!-- TODO: why is label needed? -->
        <label class="custom-control-label" for="{key}__opt"></label>
      </div>
      {:else}
      <select class="custom-select custom-select-sm" id="{key}__opt" bind:value={data.value}>
        {#each data.allowed as option}
        <option value={option}>{option}</option>
        {/each}
      </select>
      {/if}
    {:else}
    <!-- TODO: clean up '-' values to empty string -->
    <!-- TODO: add placeholder="RATE_1", etc.-->
    <input class="form-control" id="{key}__opt" type="text" bind:value={data.value} />
    {/if}
  </div>

  <!-- TODO: fix buttons, don't use "close" labels, etc. -->
  <div class="col my-1" style="color:#0062cc;">
    {#if data.value.toString() !== data.default.toString()}
    <a style="font-size:2em;line-height:0" href="#reset" title="Reset to default" on:click={e => (data.value = data.default)}>
      {@html SvgUndo}
    </a>
    {/if}
    
    {#if data.desc}
    <span style="font-size:2em;line-height:0" data-toggle="tooltip" data-html="true" data-placement="left"
    title="{data.aka ? data.desc + `<br><i>BFC Name: <b>${data.aka}</b></i>` : data.desc}">
      {@html SvgInfo}
    </span>
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
  .row.nondefault {
    /* background-color: #b5ffd4; */
  }
  .row:nth-child(odd) {
    /* background-color: #f4f4f4; */
  }
  .row:nth-child(odd).nondefault {
    /* background-color: #7ff7b1; */
  }
  .row {
    padding: .5em 0;
    border-top: 1px solid #e7e7e7;
  }
  .description {
    display: none;
  }
</style>
