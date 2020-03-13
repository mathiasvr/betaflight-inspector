<script>
  export let value

  const getX = x => x & 31
  const getY = y => (y >> 5) & 31
  const getPos = (x, y, p) => x | (y << 5) | (p << 11)
  const visibleInProfile = (pos, profile) => !!(pos & (1 << (profile + 11)))

  $: x = getX(value)
  $: y = getY(value)

  const profiles = []
  $: for (let i = 0; i < 3; i++) {
    profiles[i] = visibleInProfile(value, i)
  }

  const update = () => {
    const p = profiles.reduce((p, c, i) => p | (c << i))

    value = getPos(x, y, p)
  }
</script>

<div class="form-inline">
  <div class="pr-2 input-group input-group-sm">
    <div class="input-group-prepend">
      <span class="input-group-text">X</span>
    </div>
    <input class="form-control form-control-sm" id="inputX" type="number" min="0" max="31" bind:value={x} on:change={update} />
  </div>
  <div class="pr-2 input-group input-group-sm">
    <div class="input-group-prepend">
      <span class="input-group-text">Y</span>
    </div>
    <input class="form-control form-control-sm" id="inputY" type="number" min="0" max="31" bind:value={y} on:change={update} />
  </div>
  <div>
    <!-- OSD Profile:<br> -->
    {#each profiles as profile}
    <input type="checkbox" bind:checked={profile} on:change={update} />&nbsp;
    {/each}
  </div>
</div>
