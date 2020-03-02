<script>
  import VariableTable from './components/VariableTable.svelte'

  export let bfvariables
  const activeProfile = bfvariables.activeProfile
  const activeRateProfile = bfvariables.activeRateProfile

  // TODO: get from bf
  const profiles = [1, 2, 3]
  const rateprofiles = [1, 2, 3, 4, 5, 6]
  
  let selectedProfile = profiles[activeProfile]
  let selectedRateProfile = rateprofiles[activeRateProfile]

  let showDefaults = true

  // TODO: update on change in app?
  const masterVariables = bfvariables.masterVars
  $: profileVariables = bfvariables.profilesVars[selectedProfile - 1]
  $: rateVariables = bfvariables.rateProfilesVars[selectedRateProfile - 1]
</script>

<div>
  <h1>Variables</h1>

  <div class="custom-control custom-switch">
    <input type="checkbox" class="custom-control-input" id="switchDiffOnly" bind:checked={showDefaults}>
    <label class="custom-control-label" for="switchDiffOnly">Show default settings</label>
  </div>

  <h2>Master Variables</h2>
  <VariableTable variables={masterVariables} {showDefaults} />

  <h2>Profile Variables</h2>
  <form class="form-inline my-4">
    <label class="mr-sm-2" for="profileSelect">Profile</label>
    <select class="custom-select" id="profileSelect" bind:value={selectedProfile}>
      {#each profiles as p}
      <option value={p}>{p}</option>
      {/each}
    </select>
  </form>
  <VariableTable variables={profileVariables} {showDefaults} />

  <h2>Rate Profile Variables</h2>
  <form class="form-inline my-4">
    <label class="mr-sm-2" for="rateSelect">Rate profile</label>
    <select class="custom-select" id="rateSelect" bind:value={selectedRateProfile}>
      {#each rateprofiles as r}
      <option value={r}>{r}</option>
      {/each}
    </select>
  </form>
  <VariableTable variables={rateVariables} {showDefaults} />
</div>
