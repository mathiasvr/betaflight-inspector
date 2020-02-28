<script>
  import VariableRow from './VariableRow.svelte'

  export let variables
</script>

{#each variables as varData}
  <VariableRow variable={varData} />
{/each}
