<script>
  import ConnectView from './ConnectView.svelte'
  import VariablesView from './VariablesView.svelte'

  let portPaths = []
  let bfvariables = null

  window.ipc
    .on('received-bf-configuration', (event, bfvars) => { bfvariables = bfvars })
    .on('serial-ports-updated', (event, ports) => { portPaths = ports.map(p => p.path) })
</script>

<div class="container-fluid" >
  {#if bfvariables}
    <VariablesView {bfvariables} />
  {:else}
    <ConnectView {portPaths} />
  {/if}
</div>
