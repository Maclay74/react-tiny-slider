# React Tiny Slider

> Tiny slider wrapper for React

[![NPM](https://img.shields.io/npm/v/react-tiny-slider.svg)](https://www.npmjs.com/package/react-tiny-slider) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Motivation
There are a lot of other solutions for gallery sliders, and all of them have pros and cons, obviously. 
But all of them doesn't have so much functions as tiny slider has but have a lot of bugs instead.

I went thought all of them, tested and checked, and no one fulfilled my demand. Although, there is an tiny slider, which works like a charm (mostly) and the only thing left is to just wrap it.

And they did! There are currently two other solutions for React + Tiny slider, but both of them doesn't appreciate dynamic content changing.
When you try to update your Carousel children, you get an error, period.

So, I decided to fix this and rewrite it in TypeScript, for the sake of usability. 

## Install

```bash
yarn add react-tiny-slider
```

## Usage

Nothing special, just import component. All props are 
[tiny slider settings](https://github.com/ganlanyuan/tiny-slider#options). (See below)

You can find a complete example with two carousels in **example folder**, but if you're lazy, there is one more: 

```tsx
import React, { Component } from 'react'
import Carousel from 'react-tiny-slider'

class Example extends Component {

  render() {
    return <Carousel
        swipeAngle={false}
        items={3}
        mouseDrag
        ref={carousel}
        controls={false}
        nav={false}
      >
        {slides.map((slide) => {
          return <div>
            <div className={'slide'}>{slide}</div>
          </div>
        })}
      </Carousel>
  }
}
```

### Slides
Use children prop to pass slides. Important thing to remember - they all are going to be converted to pure html, so no React shit (events, etc) is allowed. 

### Control carousel
Pass ref prop to the Carousel to get TinySlider instance. Then you can call [it's functions](https://github.com/ganlanyuan/tiny-slider#methods), just like that
```tsx
// Import useRef
import React, { useRef } from 'react'

// In component, create ref
const carousel = useRef(null)

// Call tinyslider's methods
const goNextSlide = () => carousel.current.goTo('next')
```

### And then how do I suppose to handle click event on slide, genius?
Pass **onClick** prop to the **Carousel** component, you'll get clicked slide position, information about slider and event itself.  
```tsx
onClick={(slideIndex, info, event) => {
    // Do something
}}
```


## License

MIT © [Maclay74](https://github.com/Maclay74)
