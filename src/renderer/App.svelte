<script>
  import ConnectView from './ConnectView.svelte'
  import VariableTable from './components/VariableTable.svelte'

  let masterVariables = null
  let profileVariables = null
  let rateVariables = null

  window.ipc.on('received-bf-configuration', (event, bfvars) => {
    masterVariables = Object.entries(bfvars.masterVars)
    // TODO: allow switching (currently just profile/rate 0)
    profileVariables = Object.entries(bfvars.profilesVars[0])
    rateVariables = Object.entries(bfvars.rateProfilesVars[0])
  })
</script>

<div class="container">
  <h1>Connect Flight Controller</h1>
  <ConnectView />

  {#if masterVariables}
  <h1>Variables</h1>
  <h2>Master Variables</h2>
  <VariableTable variables={masterVariables} />
  <h2>Profile Variables</h2>
  <VariableTable variables={profileVariables} />
  <h2>Rate Profile Variables</h2>
  <VariableTable variables={rateVariables} />
  {/if}
</div>
