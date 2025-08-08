const dragItems = document.querySelectorAll('.drag-item');
const dropZones = document.querySelectorAll('.drop-zone');
const result = document.getElementById('result');

dragItems.forEach(item => {
  item.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', item.dataset.type);
  });
});

dropZones.forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
  });

  zone.addEventListener('drop', e => {
    e.preventDefault();
    const draggedType = e.dataTransfer.getData('text/plain');
    const matchType = zone.dataset.match;

    if (draggedType === matchType) {
      zone.textContent = `✅ Matched ${matchType}`;
      zone.style.backgroundColor = '#c3e6cb';
      result.textContent = `Great job! You matched ${matchType}.`;
    } else {
      result.textContent = `Oops! ${draggedType} doesn’t match ${matchType}. Try again!`;
    }
  });
});


