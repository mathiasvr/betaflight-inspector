<script>
  import SvgConnect from 'bootstrap-icons/icons/arrow-left-right.svg'

  export let portPaths

  let connecting = false
  let lastErrorMsg

  // HACK: Svelte binding doesn't work when updating select options.
  //       https://github.com/sveltejs/svelte/issues/1764
  let selectedPortPath_does_not_work
  const selectedPortPath = () =>
    document.getElementById('selectPort').value

  function handleClick (event) {
    connecting = true
    const portPath = selectedPortPath()
    console.log('selected port?:', selectedPortPath_does_not_work)
    console.log('selected port:', portPath)

    // Request connecting to serial port
    window.ipc.send('connect-serial-scrape-info', portPath)
  }

  // TODO: establish IPC naming convention
  window.ipc.send('list-serial-ports')

  window.ipc.on('connection-error', (event, err) => {
    connecting = false
    lastErrorMsg = err.message
  })
</script>

<div>

  <form class="form-connect">

    <div class="form-group text-center">
      <div class="mb-3" style="font-size:4rem;">{@html SvgConnect}</div>
      <h1 class="h3 font-weight-normal">Connect Flight Controller</h1>
    </div>

    <div class="form-group">
      <label class="" for="selectPort">Serial port</label>
      <select
        class="custom-select custom-select-lg"
        id="selectPort"
        size="3"
        bind:value={selectedPortPath_does_not_work}>
        {#each portPaths as port, i}
          <option value={port} selected={i === 0}>{port}</option>
        {/each}
      </select>
    </div>

    <button class="btn btn-lg btn-primary btn-block" type="button" on:click={handleClick} disabled={connecting}>
      {#if connecting}
      Connecting...
      {:else}
      Connect
      {/if}
    </button>

    <div class="mt-5 text-center">
      {#if connecting}
      <div class="spinner-border text-primary" role="status" style="width: 2rem; height: 2rem;">
        <span class="sr-only">Loading...</span>
      </div>
      {:else if lastErrorMsg}
      <div class="alert alert-danger" role="alert">
        <b>Connection error:</b> {lastErrorMsg}
      </div>
      {/if}
    </div>

  </form>

</div>

<style>
  .form-connect {
    max-width: 350px;
    padding: 40px 15px;
    margin: auto;
  }
</style>
