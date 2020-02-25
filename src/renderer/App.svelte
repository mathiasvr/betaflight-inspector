<script>
  import ConnectView from './ConnectView.svelte'
  import VariableTable from './components/VariableTable.svelte'

  let conf = null

  window.ipc.on('received-bf-configuration', (event, bfconf) => {
    // TODO: Display/merge all data
    const variables = bfconf.dump.master.variables
  
    conf = Object.entries(variables)
    console.log('conf', conf)
  })
</script>

<div class="container">
  <h1>Connect Flight Controller</h1>
  <ConnectView />

  {#if conf}
  <h1>Variables</h1>
  <VariableTable variables={conf} />
  {/if}
</div>
