(function () {
  var chips = document.querySelectorAll('[data-filter]');
  var rows = document.querySelectorAll('[data-tags]');
  var count = document.querySelector('[data-count]');
  function apply(key) {
    var shown = 0;
    rows.forEach(function (row) {
      var show = key === 'all' || row.getAttribute('data-tags').split(' ').indexOf(key) !== -1;
      row.hidden = !show;
      if (show) shown++;
    });
    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', chip.getAttribute('data-filter') === key ? 'true' : 'false');
    });
    if (count) count.textContent = shown + ' of ' + rows.length;
  }
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () { apply(chip.getAttribute('data-filter')); });
  });
})();
