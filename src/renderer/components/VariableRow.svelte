<script>
  import { slide } from 'svelte/transition'
  import marked from 'marked'
  import SvgInfo from 'bootstrap-icons/icons/info-square.svg'
  import SvgUndo from 'bootstrap-icons/icons/arrow-counterclockwise.svg'
  import OSDPosition from './osdPosition.svelte'

  export let variable
  // TODO: rename?
  $: data = variable

  let showHelp = false
</script>

<!-- TODO: fix hash scroll position -->
<div class="row" id="{data.name}">
<!-- TODO: fix types for comparison  -->
  <div class="col my-1 pr-0 text-monospace font-weight-bold" style="max-width:0;color:#0062cc;">
    {data.value.toString() !== data.default.toString() ? '*' : ''}
  </div>
  <div class="col-4 my-1 text-monospace text-break">{data.name}</div>

  <div class="col-5 my-1">
    {#if data.range}
      <div class="form-row align-items-center">
        {#if Math.abs(data.range[1] - data.range[0]) <= 10000}
        <div class="col">
          <input class="custom-range" type="range" min={data.range[0]} max={data.range[1]} bind:value={data.value}/>
        </div>
        {/if}
        
        <div class="col-sm-auto">
          <!-- TODO: should this only be -sm when there is range slider? -->
          <div class="input-group input-group-sm">
            <input class="form-control" type="number" min={data.range[0]} max={data.range[1]} bind:value={data.value}/>
            {#if data.unit}
            <div class="input-group-append">
              <span class="input-group-text">{data.unit}</span>
            </div>
            {/if}
          </div>
        </div>

        {#if data.name.startsWith('osd_') && data.name.endsWith('_pos') && data.range[1] === 0x3BFF}
        <div class="col">
          <OSDPosition value={data.value} />
        </div>
        {/if}
      </div>

    {:else if data.allowed}
      <!-- TODO: make this type boolean before-hand for easier binding? -->
      {#if data.allowed.length === 2 && data.allowed.includes('ON') && data.allowed.includes('OFF')}
      <div class="custom-control custom-switch">
        <input class="custom-control-input" id="{data.name}_switch" type="checkbox" checked={data.value === 'ON'} on:change={data.value = this.checked ? 'ON' : 'OFF' } />
        <label class="custom-control-label" for="{data.name}_switch"></label>
      </div>
      {:else}
      <select class="custom-select custom-select-sm" bind:value={data.value}>
        {#each data.allowed as option}
        <option value={option}>{option}</option>
        {/each}
      </select>
      {/if}
    {:else}
    <!-- TODO: clean up '-' values to empty string -->
    <!-- TODO: add placeholder="RATE_1", etc.-->
    <input class="form-control" type="text" bind:value={data.value} />
    {/if}
  </div>

  <div class="col my-1" style="color:#0062cc;">
    {#if data.value.toString() !== data.default.toString()}
    <a style="font-size:2em;line-height:0" href="#reset" title="Reset to default" on:click={e => (data.value = data.default)}>
      {@html SvgUndo}
    </a>
    {/if}
    
    {#if data.desc}
    <!-- <a href="#_" style="font-size:2em;line-height:0" data-toggle="tooltip" data-html="true" data-placement="left"
    title="{data.aka ? data.desc + `<br><i>BFC Name: <b>${data.aka}</b></i>` : data.desc}">
      {@html SvgInfo}
    </a> -->
    <a href="#_" style="font-size:2em;line-height:0" title="Toggle help info" on:click={() => { showHelp = !showHelp }}>
      {@html SvgInfo}
    </a>
    {/if}
  </div>

  {#if data.desc && showHelp}
  <div class="col-9 ml-4 pl-3 font-weight-light" transition:slide="{{ duration: 150 }}">
    <!-- TODO: preprocess markdown -->
    {@html marked(data.desc.replace(/(?<!\]\()#([\w_]+)/, '[$1](#$1)'))}
  </div>
  {/if}

</div>

<style>
  .row {
    padding: .5em 0;
    border-top: 1px solid #e7e7e7;
  }
</style>
