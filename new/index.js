var pp = new PencilPaper(document.getElementById('collage'));
pp.addFactory(function() {
  var img = document.createElement('img');
  img.src = 'http://images.askmen.com/photos/mark-zuckerberg/83067.jpg'
  return img;
});
pp.start();