export default function patchFlyoutMinWidth(ScratchBlocks, minWidth = 520) {
  const protos = [];

  if (ScratchBlocks && ScratchBlocks.VerticalFlyout && ScratchBlocks.VerticalFlyout.prototype) {
    protos.push(ScratchBlocks.VerticalFlyout.prototype);
  }
  if (ScratchBlocks && ScratchBlocks.Flyout && ScratchBlocks.Flyout.prototype) {
    protos.push(ScratchBlocks.Flyout.prototype);
  }

  const clampWidth = function () {
    const w = Math.max(this.width_ || 0, minWidth);
    this.width_ = w;

    if (this.svgBackground_) this.svgBackground_.setAttribute('width', w);
    if (this.clipRect_) this.clipRect_.setAttribute('width', w);

    // Some versions reposition after reflow; keep it in sync if available
    if (typeof this.position === 'function') this.position();
  };

  protos.forEach(proto => {
    if (proto.__qsMinWidthPatched) return;
    proto.__qsMinWidthPatched = true;

    if (typeof proto.reflowInternal_ === 'function') {
      const original = proto.reflowInternal_;
      proto.reflowInternal_ = function (...args) {
        const res = original.apply(this, args);
        clampWidth.call(this);
        return res;
      };
      return;
    }

    if (typeof proto.reflow === 'function') {
      const original = proto.reflow;
      proto.reflow = function (...args) {
        const res = original.apply(this, args);
        clampWidth.call(this);
        return res;
      };
    }
  });
}
