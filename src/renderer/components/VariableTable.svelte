<script>
  import VariableRow from './VariableRow.svelte'

  export let variables
  export let showDefaults

  // TODO: jquery / popper: if needed probably call individually
  window.$(() => window.$('[data-toggle="tooltip"]').tooltip())
</script>

{#each variables as varData}
  <!-- TODO: fix types for comparison -->
  {#if showDefaults || varData.value.toString() !== varData.default.toString()}
  <VariableRow variable={varData} />
  {/if}
{/each}
