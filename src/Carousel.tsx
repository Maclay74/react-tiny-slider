import React, {CSSProperties, MouseEvent, useEffect, useRef} from 'react'
import {tns} from 'tiny-slider/src/tiny-slider'
import 'tiny-slider/dist/tiny-slider.css'
import {TinySliderInfo, TinySliderInstance, TinySliderSettings} from 'tiny-slider'
import {getCloneCountForLoop} from "./helpers";

interface ReactTinySliderConfig extends TinySliderSettings {
  onClick?: (slideClicked: Element | null, info: any, event: MouseEvent) => void
  onIndexChanged?: (info: TinySliderInfo) => void
  onTransitionStart?: (info: TinySliderInfo) => void
  onTransitionEnd?: (info: TinySliderInfo) => void
  onTouchStart?: (info: TinySliderInfo) => void
  onTouchMove?: (info: TinySliderInfo) => void
  onTouchEnd?: (info: TinySliderInfo) => void
  children: JSX.Element[] | JSX.Element
  className?: string
  style?: CSSProperties,
}

const Carousel = React.forwardRef(
  // @ts-ignore
  (props: ReactTinySliderConfig, ref: (ref: TinySliderInstance) => void) => {
    const slider = useRef<TinySliderInstance | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const dragging = useRef<boolean>(false)

    const onClick = (event: MouseEvent) => {
      const {onClick} = props

      if (dragging.current || !onClick) return
      if (!slider.current) return onClick(null, null, event)

      const info = slider.current.getInfo()
      const slideClicked = info.slideItems[info.index]
      onClick(slideClicked, info, event)
    }

    const build = (newSettings: ReactTinySliderConfig) => {


      const settings: ReactTinySliderConfig = {
        ...newSettings,
        onInit: () => {
          // settings.onInit && settings.onInit()
          postInit()
        },
        container: containerRef.current as HTMLElement,
      }

      slider.current = tns(settings)
    }

    const postInit = () => {
      const events = slider.current?.events

      if (events) {
        events.on('transitionStart', (info: TinySliderInfo) => {
          dragging.current = true
          props.onTransitionStart && props.onTransitionStart(info)
        })

        events.on('transitionEnd', (info: TinySliderInfo) => {
          dragging.current = false
          props.onTransitionEnd && props.onTransitionEnd(info)
        })
      }

      setTimeout(() => {
        // @ts-ignore
        ref.current = slider.current
      })
    }

    useEffect(() => {
      build(props)

      return () => {
        slider.current && slider.current.destroy()
      }
    }, [props])

    const generateSlides = (children: JSX.Element[] | JSX.Element) => {
      const slideCount = React.Children.count(children);
      const cloneCount = props.loop ? getCloneCountForLoop(props, slideCount) : 0
      const beforeClones = [];
      const afterClones = [];

      for (let j = cloneCount; j--;) {
        const num = j % slideCount;

        if (children !== undefined) {
          const cloneFirst = React.cloneElement(children[num], {
            className: "tns-item tns-slide-cloned",
            id: null,
            key: 'item-clone-first' + children[num].key
          });

          afterClones.unshift(cloneFirst)

          if (props.mode === 'carousel') {
            const cloneLast = React.cloneElement(children[slideCount - 1 - num], {
              className: "tns-item tns-slide-cloned",
              id: null,
              key: 'item-clone-last' + children[num].key
            });
            beforeClones.push(cloneLast);
          }
        }
      }

      return [
        ...beforeClones,
        ...React.Children.toArray(children),
        ...afterClones
      ];
    }

    return (
      <div
        onClick={onClick}
        className={'tns-outer'}
        id={'tns1-ow'}
      >
        <div className={'tns-ovh'} id={'tns1-mw'}>
          <div className={'tns-inner'} id={'tns1-iw'} ref={containerRef}>
            {generateSlides(props.children)}
          </div>
        </div>
      </div>
    )
  }
)

export default Carousel
