<script>
  export let value

  const visibleInProfile = (pos, profile) => !!(pos & (1 << (profile + 11)))
  const getX = (x) => x & 0x1f
  const getY = (x) => (x >> 5) & 0x1f

  // TODO: bind value both ways
</script>

<div class="form-inline">
  <div class="pr-2 input-group input-group-sm">
    <div class="input-group-prepend">
      <span class="input-group-text">X</span>
    </div>
    <input class="form-control form-control-sm" id="inputX" type="number" min="0" max="31" value={getX(value)} />
  </div>
  <div class="pr-2 input-group input-group-sm">
    <div class="input-group-prepend">
      <span class="input-group-text">Y</span>
    </div>
    <input class="form-control form-control-sm" id="inputY" type="number" min="0" max="31" value={getY(value)} />
  </div>
  <div>
    <!-- OSD Profile:<br> -->
    <input type="checkbox" checked={visibleInProfile(value, 0)} />
    <input type="checkbox" checked={visibleInProfile(value, 1)} />
    <input type="checkbox" checked={visibleInProfile(value, 2)} />
  </div>
</div>
