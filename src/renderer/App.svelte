<script>
  import ConnectView from './ConnectView.svelte'
  import VariablesView from './VariablesView.svelte'

  let bfvariables

  window.ipc.on('received-bf-configuration', (event, bfvars) => {
    bfvariables = bfvars
  })
</script>

<div class="container">
  {#if bfvariables}
    <VariablesView {bfvariables} />
  {:else}
    <ConnectView />
  {/if}
</div>
