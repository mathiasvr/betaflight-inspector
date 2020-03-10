<script>
  import VariableRow from './VariableRow.svelte'

  export let variables
  export let hideDefaults

  // TODO: jquery / popper: if needed probably call individually
  // window.$(() => window.$('[data-toggle="tooltip"]').tooltip())
</script>

{#each variables as varData}
  {#if !hideDefaults || varData.value !== varData.default}
  <VariableRow variable={varData} />
  {/if}
{/each}
