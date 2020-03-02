<script>
  import VariableRow from './VariableRow.svelte'

  export let variables
  export let showDefaults
</script>

{#each variables as varData}
  <!-- TODO: fix types for comparison -->
  {#if showDefaults || varData.value.toString() !== varData.default.toString()}
  <VariableRow variable={varData} />
  {/if}
{/each}
