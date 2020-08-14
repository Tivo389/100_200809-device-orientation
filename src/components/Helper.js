export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = setTimeout(() => { inThrottle = false }, limit);
    }
  }
};

export const addClass = (domTarget, className) => {
  domTarget.classList.add(className);
};

export const removeClass = (domTarget, className) => {
  domTarget.classList.remove(className);
};