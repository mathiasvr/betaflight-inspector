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

  const isPosition = (data) => data.name.startsWith('osd_') && data.name.endsWith('_pos') && data.range[1] === 0x3BFF
</script>

<!-- TODO: fix hash scroll position -->
<div class="row" id="{data.name}">
  <div class="col pr-0 text-monospace font-weight-bold" style="max-width:0;color:#0062cc;">
    {data.value !== data.default ? '*' : ''}
  </div>
  <div class="col-4">
    <div class="text-monospace text-break">{data.name}</div>
    {#if data.title}
    <div class="text-muted" style="font-size:0.9rem">{data.title}</div>
    {/if}
  </div>

  <div class="col-5">
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

        {#if isPosition(data)}
        <div class="col">
          <OSDPosition bind:value={data.value} />
        </div>
        {/if}
      </div>

    {:else if data.allowed}
      <!-- TODO: make this type boolean before-hand for easier binding? -->
      {#if data.allowed.length === 2 && data.allowed.includes('ON') && data.allowed.includes('OFF')}
      <div class="custom-control custom-switch">
        <input class="custom-control-input" id="switch_{data.name}" type="checkbox" checked={data.value === 'ON'} on:change={(v => { data.value = v })(this.checked ? 'ON' : 'OFF')} />
        <label class="custom-control-label" for="switch_{data.name}"></label>
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

  <div class="col" style="color:#0062cc;">
    {#if data.value !== data.default}
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
  <div class="col-9 my-2 font-weight-light" style="padding-left: 2.3rem" transition:slide="{{ duration: 150 }}">
    <!-- TODO: preprocess markdown -->
    {@html marked(data.desc.replace(/(?<!\]\()#([\w_]+)/, '[$1](#$1)')).slice(3, -5)}
  </div>
  {/if}

</div>

<style>
  .row {
    padding: .5em 0;
    border-top: 1px solid #e7e7e7;
  }
</style>
