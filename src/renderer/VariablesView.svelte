<script>
  import VariableTable from './components/VariableTable.svelte'

  export let bfvariables

  // copy to bind properties without changing the original config
  // TODO: this means variables cannot be updated by app - is this a problem?
  const bfvars = Object.assign({}, bfvariables)

  let showDefaults = true
  
  // TODO: get from bf
  const profiles = [1, 2, 3]
  const rateprofiles = [1, 2, 3, 4, 5, 6]

  // TODO: update on change in app?
  const masterVariables = bfvars.masterVars
  $: profileVariables = bfvars.profilesVars[bfvars.activeProfile]
  $: rateVariables = bfvars.rateProfilesVars[bfvars.activeRateProfile]
</script>

<div>
  <h1>Variables</h1>
  <div class="custom-control custom-switch">
    <input type="checkbox" class="custom-control-input" id="switchDiffOnly" bind:checked={showDefaults}>
    <label class="custom-control-label" for="switchDiffOnly">Show default settings</label>
  </div>

  <!-- TODO: avoid margin hack? -->
  <h2 class="mt-3">Master Variables</h2>
  <VariableTable variables={masterVariables} {showDefaults} />

  <h2>Profile Variables</h2>
  <form class="form-inline my-4">
    <label class="mr-sm-2" for="profileSelect">Profile</label>
    <select class="custom-select" id="profileSelect" bind:value={bfvars.activeProfile}>
      {#each profiles as p}
      <option value={p - 1}>{p}</option>
      {/each}
    </select>
  </form>
  <VariableTable variables={profileVariables} {showDefaults} />

  <h2>Rate Profile Variables</h2>
  <form class="form-inline my-4">
    <label class="mr-sm-2" for="rateSelect">Rate profile</label>
    <select class="custom-select" id="rateSelect" bind:value={bfvars.activeRateProfile}>
      {#each rateprofiles as r}
      <option value={r - 1}>{r}</option>
      {/each}
    </select>
  </form>
  <VariableTable variables={rateVariables} {showDefaults} />
</div>
