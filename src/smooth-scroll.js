import EventEmitter from '@web-alchemy/event-emitter';

class SmoothScroll extends EventEmitter {
  static get defaultOptions() {
    return {
      ease: 0.1
    }
  }

  constructor(options) {
    super();
    this._options = {
      ...SmoothScroll.defaultOptions,
      ...options
    };
    this._state = {
      current: 0,
      target: 0,
      ticking: false
    };
    this._getScroll = this._options.scrollContainer
      ? this._getContainerScroll
      : this._getWindowScroll;
    this._update = this._update.bind(this);
    this._onScroll = this._onScroll.bind(this);
    (this._options.scrollContainer || window).addEventListener('scroll', this._onScroll, { passive: true });
  }

  destroy() {
    (this._options.scrollContainer || window).removeEventListener('scroll', this._onScroll);
  }

  _getWindowScroll() {
    return window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
  }

  _getContainerScroll() {
    return this._options.scrollContainer.scrollTop;
  }

  _onScroll() {
    this._state.target = this._getScroll();
    this._requestTick();
  }

  _requestTick() {
    if (!this._state.ticking) {
      this._state.ticking = true;
      requestAnimationFrame(this._update);
    }
  }

  _update() {
    let { target, current } = this._state;
    const { ease } = this._options;
    const diff = target - current;
    const delta = Math.abs(diff) < 0.1 ? 0 : diff * ease;

    if (delta) {
      this._state.current = current + delta;
      requestAnimationFrame(this._update);
    } else {
      this._state.current = target;
      this._state.ticking = false;
    }

    this.emit('update', this._state.current);
  }
}

export default SmoothScroll;