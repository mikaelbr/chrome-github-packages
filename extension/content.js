(function () {

  'use strict';

  var base = 'https://www.npmjs.org/package/';

  init();

  function init () {
    if (isPackageJsonFile()) {
      replaceModuleLinks();
      return;
    }
    document.body.addEventListener('click', function (event) {
      if ((event.target.getAttribute('title') !== 'package.json')) {
        return;
      }
      var id = setInterval(function () {
        if (!isPackageJsonFile()) {
          return;
        }
        clearInterval(id);
        replaceModuleLinks();
      }, 16);
    }, false);
  }

  function replaceModuleLinks () {
    if(!isPackageJsonFile()) return;

    var packages = getPackageElements('dependencies');
    replacePackagesWithLinks(packages);

    var devPackages = getPackageElements('devDependencies');
    replacePackagesWithLinks(devPackages);

    var peerPackages = getPackageElements('peerDependencies');
    replacePackagesWithLinks(peerPackages);

    var nameField = getNameField();

    if (nameField) {
      replacePackagesWithLinks([nameField]);
    }
  }

  function isPackageJsonFile () {
    var title = document.querySelector('.final-path');
    return (title && title.textContent === 'package.json');
  }

  function getNameField () {
    var pls = document.querySelectorAll('.pl-s1');
    for(var i = 0, len = pls.length; i < len; i++) {
      var pl = pls[i];
      if (pl.innerText.indexOf("name") !== -1) {
        return pl.parentNode.querySelectorAll('.pl-s1')[1];
      }
    }
    return void 0;
  }

  function replacePackagesWithLinks(elements) {
    for(var i = 0, len = elements.length; i < len; i++) {
      var el = elements[i];
      var a = createLink(elements[i]);
      el.innerHTML = "";
      el.appendChild(a);
    }
  }

  function createLink (el) {
    var text = el.textContent.replace(/"/g, '');
    var a = document.createElement('a');
    a.href = base + text;
    a.innerText = '"' + text + '"';
    a.title = "Go to NPM Module site for " + text;
    return a;
  }

  function getPackageElements (startName) {
    var lines = document.querySelectorAll('.js-file-line');
    var packageNodes = [];
    var insideScope = false;

    for(var i = 0, len = lines.length; i < len; i++) {
      var line = lines[i];
      if (!line) continue;

      if (isStartNode(line, startName) && !isEmptyNode(line)) {
        insideScope = true;
        continue;
      }

      if (!insideScope) continue;

      if (isEndNode(line)) {
        return packageNodes;
      }

      var child = line.querySelector('.pl-s1');
      if (child) {
        packageNodes.push(child);
      }
    }

    return [];
  }

  function isEmptyNode(node) {
    return node.innerText.match(/\{\s*\}/);
  }

  function isStartNode(node, name) {
    var pl = node.querySelector('.pl-s1');
    if (!pl) return false;

    return pl.innerText.indexOf(name) !== -1;
  }

  function isEndNode(node) {
    return node.innerText.indexOf("}") !== -1;
  }
}());
