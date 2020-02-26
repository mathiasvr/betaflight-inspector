<script>
  import VariableTable from './components/VariableTable.svelte'

  export let bfvariables

  // todo: update on change in app?
  const masterVariables = Object.entries(bfvariables.masterVars)
  // TODO: allow switching (currently just profile/rate 0)
  const profileVariables = Object.entries(bfvariables.profilesVars[0])
  const rateVariables = Object.entries(bfvariables.rateProfilesVars[0])
</script>

<div>
  <h1>Variables</h1>

  <h2>Master Variables</h2>
  <VariableTable variables={masterVariables} />

  <h2>Profile Variables</h2>
  <VariableTable variables={profileVariables} />

  <h2>Rate Profile Variables</h2>
  <VariableTable variables={rateVariables} />
</div>
