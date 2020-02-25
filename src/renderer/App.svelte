<script>
  import ConnectView from './ConnectView.svelte'
  import VariableTable from './components/VariableTable.svelte'

  let variables = null

  window.ipc.on('received-bf-configuration', (event, bfvars) => {
    variables = Object.entries(bfvars)
  })
</script>

<div class="container">
  <h1>Connect Flight Controller</h1>
  <ConnectView />

  {#if variables}
  <h1>Variables</h1>
  <VariableTable {variables} />
  {/if}
</div>
