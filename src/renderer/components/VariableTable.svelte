<script>
  import VariableRow from './VariableRow.svelte'

  export let variables
  export let showDefaults
</script>

{#each variables as varData}
  {#if showDefaults || varData.value !== varData.default}
  <VariableRow variable={varData} />
  {/if}
{/each}
