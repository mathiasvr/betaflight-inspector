<script>
  let portPaths = []

  // HACK: Svelte binding doesn't work when updating select options.
  //       https://github.com/sveltejs/svelte/issues/1764
  let selectedPortPath_does_not_work
  const selectedPortPath = () =>
    document.getElementById('selectPort').value

  function handleClick (event) {
    const portPath = selectedPortPath()
    console.log('selected port?:', selectedPortPath_does_not_work)
    console.log('selected port:', portPath)

    // Request connecting to serial port
    window.ipc.send('connect-serial-scrape-info', portPath)
  }

  // TODO: should this be moved to App?
  window.ipc.on('serial-ports-updated', (event, ports) => {
    portPaths = ports.map(p => p.path)
  })

  // TODO: establish IPC naming convention
  window.ipc.send('list-serial-ports')
</script>

<div>
  <h1>Connect Flight Controller</h1>

  <form class="form-inline my-4">
    <label class="mr-sm-2" for="selectPort">Serial port</label>
    <select
      class="custom-select mr-sm-2"
      id="selectPort"
      size="3"
      bind:value={selectedPortPath_does_not_work}>
      {#each portPaths as port, i}
        <option value={port} selected={i === 0}>{port}</option>
      {/each}
    </select>

    <!-- <div class="custom-control custom-checkbox my-1 mr-2">
      <input type="checkbox" class="custom-control-input" id="customControlInline">
      <label class="custom-control-label" for="customControlInline">Remember my preference</label>
    </div> -->

    <button type="button" class="btn btn-primary" on:click={handleClick}>
      Connect
    </button>
  </form>

</div>
