<script>
  export let value

  const visibleInProfile = (pos, profile) => !!(pos & (1 << (profile + 11)))
  const getX = (x) => x & 0x1f
  const getY = (x) => (x >> 5) & 0x1f

  // TODO: bind value both ways
</script>

<div class="form-row pt-2">
  <label for="inputX" class="col-auto col-form-label col-form-label-sm">X:</label>
  <div class="col">
    <input class="form-control form-control-sm" id="inputX" type="number" min="0" max="31" value={getX(value)} />
  </div>
  <label for="inputY" class="col-auto col-form-label col-form-label-sm">Y:</label>
  <div class="col">
    <input class="form-control form-control-sm" id="inputY" type="number" min="0" max="31" value={getY(value)} />
  </div>
  <div class="col">
    <!-- OSD Profile:<br> -->
    <input type="checkbox" checked={visibleInProfile(value, 0)} />
    <input type="checkbox" checked={visibleInProfile(value, 1)} />
    <input type="checkbox" checked={visibleInProfile(value, 2)} />
  </div>
</div>
