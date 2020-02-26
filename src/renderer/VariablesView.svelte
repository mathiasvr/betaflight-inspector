<script>
  import VariableTable from './components/VariableTable.svelte'

  // todo: get active prof and rateprof
  export let bfvariables

  // todo: get from bf
  const profiles = [1, 2, 3]
  const rateprofiles = [1, 2, 3, 4, 5, 6]
  
  let selectedProfile = profiles[0]
  let selectedRateProfile = rateprofiles[0]

  // todo: update on change in app?
  const masterVariables = Object.entries(bfvariables.masterVars)
  $: profileVariables = Object.entries(bfvariables.profilesVars[selectedProfile - 1])
  $: rateVariables = Object.entries(bfvariables.rateProfilesVars[selectedRateProfile - 1])
</script>

<div>
  <h1>Variables</h1>

  <h2>Master Variables</h2>
  <VariableTable variables={masterVariables} />

  <h2>Profile Variables</h2>
  <form class="form-inline my-4">
    <label class="mr-sm-2" for="profileSelect">Profile</label>
    <select class="custom-select" id="profileSelect" bind:value={selectedProfile}>
      {#each profiles as p}
      <option value={p}>{p}</option>
      {/each}
    </select>
  </form>
  <VariableTable variables={profileVariables} />

  <h2>Rate Profile Variables</h2>
  <form class="form-inline my-4">
    <label class="mr-sm-2" for="rateSelect">Rate profile</label>
    <select class="custom-select" id="rateSelect" bind:value={selectedRateProfile}>
      {#each rateprofiles as r}
      <option value={r}>{r}</option>
      {/each}
    </select>
  </form>
  <VariableTable variables={rateVariables} />
</div>
