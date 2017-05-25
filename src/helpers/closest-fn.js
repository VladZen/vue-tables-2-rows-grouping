// https://stackoverflow.com/questions/18663941/finding-closest-element-without-jquery
export default function closest (el, selector) {
  let matchesFn;

  // find vendor prefix
  ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function (fn) {
    if (typeof document.body[fn] == 'function') {
      matchesFn = fn;
      return true;
    }
    return false;
  })

  let parent;

  // traverse parents
  while (el) {
    parent = el.parentElement;
    if (parent && parent[matchesFn](selector)) {
      return parent;
    }
    el = parent;
  }

  return null;
}
