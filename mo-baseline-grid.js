(function() {
  function makeCanvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', width || 320);
    canvas.setAttribute('height', height || 480);

    return canvas;
  }

  function drawLineAtBottom(canvas) {
    var context = canvas.getContext('2d');
    context.moveTo(0, canvas.height);
    context.lineTo(canvas.width, canvas.height);
    context.strokeStyle = moBaselineScriptTagOptions().color;
    context.stroke();
    return canvas;
  }

  function baselineCanvasForLineHeight(lineHeight) {
    return drawLineAtBottom(makeCanvas(10, lineHeight));
  }

  function dataURL(canvas) { return canvas.toDataURL(); }

  function append(parentNode, childNode) { parentNode.appendChild(childNode); return parentNode; }

  function imageURLForLineHeight(lineHeight) {
    return dataURL(baselineCanvasForLineHeight(lineHeight));
  }

  function find(a, fn) {
    for ( var i = 0; i < a.length; i += 1 ) {
      if ( fn(a[i]) ) { return a[i]; }
    }
  }

  function moBaselineScriptTag() {
    return find(document.getElementsByTagName('script'), function(tag) {
      return tag.src.match('baseline-grid.js');
    });
  }

  function moBaselineScriptTagOptions() {
    var tag = moBaselineScriptTag();
    var options = {};

    if ( tag ) {
      options.line_height = tag.getAttribute('data-line-height');
      options.color = tag.getAttribute('data-color');
    }

    options.line_height = options.line_height || 32;
    options.color = options.color || '#000';

    return options;
  }

  function lineHeight() {
    return parseInt(moBaselineScriptTagOptions().line_height);
  }

  function baselineStylesheet(lineHeight) {
    var stylesheet = document.createElement('style');
    stylesheet.innerHTML = 'body { background: url("' + imageURLForLineHeight(lineHeight) + '");';
    return stylesheet;
  }

  document.addEventListener('DOMContentLoaded', function() {
    append(document.body, baselineStylesheet(lineHeight()));
  });
}());
