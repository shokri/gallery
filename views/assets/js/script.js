// Magnific Popup
function magnifPopup() {
  $('.image-popup').magnificPopup({
    type: 'image',
    removalDelay: 300,
    mainClass: 'mfp-with-zoom',
    titleSrc: 'title',
    gallery: {
      enabled: true
    },
    zoom: {
      enabled: true, // By default it's false, so don't forget to enable it

      duration: 300, // duration of the effect, in milliseconds
      easing: 'ease-in-out', // CSS transition easing function

      // The "opener" function should return the element from which popup will be zoomed in
      // and to which popup will be scaled down
      // By defailt it looks for an image tag:
      opener: function (openerElement) {
        // openerElement is the element on which popup was initialized, in this case its <a> tag
        // you don't need to add "opener" option if this code matches your needs, it's defailt one.
        return openerElement.is('img') ? openerElement : openerElement.find('img');
      }
    }
  });
};

function postData(url, data = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
}

function ElementBuilder(tagName) {
  this.element = document.createElement(tagName);

  this.class = function (c) {
    this.element.className = c;
    return this;
  }

  this.html = function (h) {
    this.element.innerHTML = h;
    return this;
  }

  this.link = function (l) {
    this.element.href = l;
    return this;
  }

  this.text = function (t) {
    this.element.textContent = t;
    return this;
  }

  this.title = function (t) {
    this.element.title = t;
    return this;
  }

  this.src = function (s) {
    this.element.src = s;
    return this;
  }

  this.onClick = function (fn) {
    this.element.onclick = fn;
    return this;
  }

  this.appendTo = function (child) {
    this.element.appendChild(child.build());
    return this;
  }

  this.build = function () {
    return this.element;
  }
}

const builder = t => new ElementBuilder(t)

class Photo {
  constructor(id, image, up, down, description) {
    this.id = id;
    this.image = `assets/images/${image}`;
    this.up = up;
    this.down = down;
    this.description = description;
  }

  render() {
    return builder('div').class('item')
      .appendTo(
        builder('div').class('animate-box')
          .appendTo(
            builder('a').link(this.image).class('image-popup fh5co-board-img')
              .appendTo(
                builder('img').src(this.image)
              )
          )
          .appendTo(
            builder('div').class('fh5co-desc').text(this.description)
              .appendTo(
                builder('div').class('fh5co-survey')
                  .appendTo(
                    builder('div').class('up').text(this.up)
                  )
                  .appendTo(
                    builder('a').html('<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>').onClick(e => app.vote({ id: this.id, vote: 'up' }))
                  )
                  .appendTo(
                    builder('a').html('<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>').onClick(e => app.vote({ id: this.id, vote: 'down' }))
                  )
                  .appendTo(
                    builder('div').class('down').text(this.down)
                  )
              )
          )
      ).build()
  }
}

class Gallery {
  constructor(list) {
    this.list = list;

    this.cachDom();
    this.render();
  }

  cachDom() {
    this.$board = document.querySelector('#fh5co-board');
    this.$column = document.querySelectorAll('#fh5co-board .column');
  }

  render() {
    const items = [];
    this.$column.forEach(e => e.innerHTML = '')

    this.list.map(e =>
      items.push(new Photo(e.id, e.image, e.up, e.down, e.description).render())
      // this.$board.appendChild(new Photo(e.id, e.image, e.up, e.down, e.description).render())
    )
    salvattore.appendElements(this.$board, items)
    magnifPopup()
  }
}

class App {
  constructor() {
    this.cachDom();
    this.bindEvents();
  }

  cachDom() {
    this.$search = document.querySelector('.fh5co-search');
  }

  render() {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(list => new Gallery(list))
  }

  bindEvents() {
    this.$search.addEventListener('input', this.search.bind(this))
  }

  search(e) {
    postData('/api/gallery/search', { search: e.target.value })
      .then(res => res.json())
      .then(list => new Gallery(list))
  }

  vote({ id, vote }) {
    postData('/api/vote', { id, vote, search: this.$search.value })
      .then(res => res.json())
      .then(list => new Gallery(list))
  }
}

const app = new App();
app.render();