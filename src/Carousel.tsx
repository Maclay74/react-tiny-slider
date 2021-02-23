import React, { CSSProperties, MouseEvent, useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server'
import { tns } from 'tiny-slider/src/tiny-slider'
import 'tiny-slider/dist/tiny-slider.css'
// @ts-ignore
import * as _ from 'lodash'
import {
  TinySliderInfo,
  TinySliderInstance,
  TinySliderSettings
} from 'tiny-slider'

interface ReactTinySliderConfig extends TinySliderSettings {
  onClick?: (
    slideClicked: number | null,
    info: any,
    event: React.MouseEvent
  ) => void
  onInit?: () => void | false
  onIndexChanged?: (info: TinySliderInfo) => void
  onTransitionStart?: (info: TinySliderInfo) => void
  onTransitionEnd?: (info: TinySliderInfo) => void
  onTouchStart?: (info: TinySliderInfo) => void
  onTouchMove?: (info: TinySliderInfo) => void
  onTouchEnd?: (info: TinySliderInfo) => void
  children: JSX.Element[] | JSX.Element
  className?: string
  style?: CSSProperties
}

const Carousel = React.forwardRef(
  (props: ReactTinySliderConfig, ref: (ref: TinySliderInstance) => void) => {
    const slider = useRef<TinySliderInstance | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const dragging = useRef<boolean>(false)

    const onClick = (event: MouseEvent) => {
      const { onClick } = props
      if (dragging.current || !onClick) return

      // when only one element the slider doesnt init
      if (!slider.current) return onClick(null, null, event)

      const info = slider.current.getInfo()

      // @ts-ignore
      const slideClickOffset = _.cloneDeep(info.slideItems)
        // @ts-ignore
        .filter((slide) => slide.classList.contains('tns-slide-active'))
        // @ts-ignore
        .findIndex((slide) => slide.contains(event.target))
      const slideClicked = (info.index + slideClickOffset) % info.slideCount

      // call click callback with info and slide clicked
      onClick(slideClicked, info, event)
    }

    const build = (newSettings: ReactTinySliderConfig) => {
      const settings: ReactTinySliderConfig = {
        ...newSettings,
        onInit: () => {
          setTimeout(postInit, 0)
        },
        container: containerRef.current?.firstChild?.firstChild as HTMLElement
      }
      slider.current = tns(settings)
    }

    const generateMarkup = () => {
      return ReactDOMServer.renderToStaticMarkup(
        <div>
          <div>{props.children}</div>
        </div>
      )
    }

    const postInit = () => {
      const events = slider.current?.events

      const {
        onIndexChanged,
        onTransitionStart,
        onTransitionEnd,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        onInit
      } = props

      if (events) {
        events.on('dragMove', (info: TinySliderInfo) => {
          dragging.current = true
          onTransitionStart && onTransitionStart(info)
        })

        events.on('dragEnd', (info: TinySliderInfo) => {
          dragging.current = false
          onTransitionEnd && onTransitionEnd(info)
        })

        if (onIndexChanged) events.on('indexChanged', onIndexChanged)
        if (onTouchStart) events.on('touchStart', onTouchStart)
        if (onTouchMove) events.on('touchMove', onTouchMove)
        if (onTouchEnd) events.on('touchEnd', onTouchEnd)
      }

      onInit && onInit()

      setTimeout(() => {
        // @ts-ignore
        ref.current = slider.current
      })
    }

    useEffect(() => {
      slider.current && slider.current.destroy()
      build(props)
    }, [props])

    return (
      <div
        onClick={onClick}
        dangerouslySetInnerHTML={{
          __html: generateMarkup()
        }}
        ref={containerRef}
      />
    )
  }
)

export default Carousel
