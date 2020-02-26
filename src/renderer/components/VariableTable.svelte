<script>
  import VariableRow from './VariableRow.svelte'

  // TODO: better format
  export let variables
</script>

{#each variables as varData}
  <VariableRow key={varData[0]} data={varData[1]} />
{/each}
