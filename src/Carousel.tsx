// @ts-nocheck
import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  MouseEvent,
  CSSProperties,
  useState
} from 'react'
import { tns } from 'tiny-slider/src/tiny-slider'
import 'tiny-slider/dist/tiny-slider.css'
import {
  TinySliderInstance,
  TinySliderSettings,
  TinySliderInfo
} from 'tiny-slider'

interface ReactTinySliderConfig extends TinySliderSettings {
  onClick?: (slideClicked: Element | null, info: any, event: MouseEvent) => void
  onIndexChanged?: (info: TinySliderInfo) => void
  onTransitionStart?: (info: TinySliderInfo) => void
  onTransitionEnd?: (info: TinySliderInfo) => void
  onTouchStart?: (info: TinySliderInfo) => void
  onTouchMove?: (info: TinySliderInfo) => void
  onTouchEnd?: (info: TinySliderInfo) => void
  children?: React.ReactNode
  className?: string
  style?: CSSProperties
}

const Carousel = React.forwardRef(
  // @ts-ignore
  (props: ReactTinySliderConfig, ref: (ref: TinySliderInstance) => void) => {
    const slider = useRef<TinySliderInstance | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const dragging = useRef<boolean>(false)
    const [showSlider, setShowSlider] = useState(true)

    const onClick = (event: MouseEvent) => {
      const { onClick } = props

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
        container: containerRef.current.firstChild as HTMLElement
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

    return (
      <div
        ref={containerRef}
        onClick={onClick}
        className={props.className}
        style={props.style}
        dangerouslySetInnerHTML={{__html: '<div> <div>1</div> <div>2</div> <div>3</div> <div>4</div> <div>5</div> <div>6</div> </div>'}}
      />
    )
  }
)

export default Carousel
