<script>
  import VariableTable from './components/VariableTable.svelte'

  export let bfvariables

  // copy to bind properties without changing the original config
  // TODO: this means variables cannot be updated by app - is this a problem?
  const bfvars = Object.assign({}, bfvariables)

  // TODO: compare bfvariables and bfvars to show what has changed, and use for saving

  let hideDefaults = true

  // TODO: get from bf
  const profiles = [1, 2, 3]
  const rateprofiles = [1, 2, 3, 4, 5, 6]

  // TODO: update on change in app?
  const masterVariables = bfvars.masterVars
  $: profileVariables = bfvars.profilesVars[bfvars.activeProfile]
  $: rateVariables = bfvars.rateProfilesVars[bfvars.activeRateProfile]
</script>

<!-- TODO: fix -->
<nav id="navbar-variables" class="navbar navbar-light bg-light fixed-top">
  <div class="navbar-brand">Variables</div>
  <div class="custom-control custom-switch">
    <input type="checkbox" class="custom-control-input" id="switchDiffOnly" bind:checked={hideDefaults}>
    <label class="custom-control-label" for="switchDiffOnly">Hide defaults</label>
  </div>
  <ul class="nav nav-pills">
    <li class="nav-item">
      <a class="nav-link" href="#master">Master</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#profile">Profile</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#rateprofile">Rate Profile</a>
    </li>
  </ul>
</nav>

<div>
  <!-- TODO: fix style and move to main view -->
  <h2 class="mb-0">Betaflight {bfvars.version.num}</h2>
  <p class="text-muted">{bfvars.version.str}</p>
  <div>
    <b>Board:</b> {bfvars.diff.globals.board_name}
    <br>
    <b>Identifier:</b> {bfvars.diff.globals.mcu_id}
  </div>
  <div class="mt-3">
    <button class="btn btn-danger" type="button" on:click={() => { bfvariables = null }}>Exit</button>
  </div>

  <!-- TODO: avoid margin hack? -->
  <h2 id="master">Master Variables</h2>
  <VariableTable variables={masterVariables} {hideDefaults} />

  <h2 id="profile">Profile Variables</h2>
  <form class="form-inline my-4">
    <label class="mr-sm-2" for="profileSelect">Profile</label>
    <select class="custom-select" id="profileSelect" bind:value={bfvars.activeProfile}>
      {#each profiles as p}
      <option value={p - 1}>{p}</option>
      {/each}
    </select>
  </form>
  <VariableTable variables={profileVariables} {hideDefaults} />

  <h2 id="rateprofile">Rate Profile Variables</h2>
  <form class="form-inline my-4">
    <label class="mr-sm-2" for="rateSelect">Rate profile</label>
    <select class="custom-select" id="rateSelect" bind:value={bfvars.activeRateProfile}>
      {#each rateprofiles as r}
      <option value={r - 1}>{r}</option>
      {/each}
    </select>
  </form>
  <VariableTable variables={rateVariables} {hideDefaults} />
</div>

<style>
  h2 {
    padding-top: 3.5rem;
  }
</style>
