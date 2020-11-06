import {TinySliderSettings} from "tiny-slider";

function getCloneCountForLoop(settings: TinySliderSettings, slideCount: number) {

  const carousel = settings.mode === 'carousel';

  console.log(carousel)
  const itemsMax = getItemsMax(settings, slideCount)
  let result = carousel ? Math.ceil((itemsMax * 5 - slideCount) / 2) : (itemsMax * 4 - slideCount)
  result = Math.max(itemsMax, result);

  return settings.edgePadding ? result + 1 : result;
}

function getItemsMax(settings: TinySliderSettings, slideCount: number) {
  // fixedWidth or autoWidth while viewportMax is not available
  // @ts-ignore
  if (settings.autoWidth || (settings.fixedWidth && !settings.fixedWidthViewportWidth)) {
    return slideCount - 1;
    // most cases
  } else {
    var str = settings.fixedWidth ? 'fixedWidth' : 'items',
      arr = [];

    if (settings.fixedWidth || settings[str] < slideCount) {
      arr.push(settings[str]);
    }

    if (settings.responsive) {
      for (var bp in settings.responsive) {
        var tem = settings.responsive[bp][str];
        if (tem && (settings.fixedWidth || tem < slideCount)) {
          arr.push(tem);
        }
      }
    }

    if (!arr.length) {
      arr.push(0);
    }

    // @ts-ignore
    return Math.ceil(settings.fixedWidth ? settings.viewportMax / Math.min.apply(null, arr) : Math.max.apply(null, arr));
  }
}


export {
  getCloneCountForLoop
}
