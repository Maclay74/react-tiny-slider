import {
  forwardRef,
  CSSProperties,
  MouseEvent,
  useEffect,
  useRef,
  useCallback
} from 'react'
import {
  tns,
  TinySliderInfo,
  TinySliderInstance,
  TinySliderSettings
} from 'tiny-slider'
import 'tiny-slider/dist/tiny-slider.css'
import { renderToStaticMarkup } from 'react-dom/server'

interface ReactTinySliderConfig extends TinySliderSettings {
  onClick?: (
    slideClicked: number | null,
    info: TinySliderInfo,
    event: React.MouseEvent
  ) => void
  onInit?: () => void | false
  onIndexChanged?: (info: TinySliderInfo) => void
  onTransitionStart?: (info: TinySliderInfo) => void
  onTransitionEnd?: (info: TinySliderInfo) => void
  onTouchStart?: (info: TinySliderInfo) => void
  onTouchMove?: (info: TinySliderInfo) => void
  onTouchEnd?: (info: TinySliderInfo) => void
  children?: JSX.Element[] | JSX.Element
  className?: string
  style?: CSSProperties
}

export const TinySlider = forwardRef(
  (props: ReactTinySliderConfig, ref: (ref: TinySliderInstance) => void) => {
    const slider = useRef<TinySliderInstance | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const dragging = useRef<boolean>(false)

    const {
      onClick,
      onIndexChanged,
      onTransitionStart,
      onTransitionEnd,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onInit,
      children
    } = props

    const clickHandler = useCallback(
      (event: MouseEvent) => {
        if (dragging.current || !onClick) return

        if (!slider.current) return onClick(null, null, event)

        const info = slider.current.getInfo()
        onClick(info.index, info, event)
      },
      [onClick]
    )

    const postInit = useCallback(() => {
      const events = slider.current?.events

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
    }, [
      onTransitionStart,
      onTransitionEnd,
      onIndexChanged,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onInit
    ])

    const build = useCallback(
      (newSettings: ReactTinySliderConfig = {}) => {
        const settings: ReactTinySliderConfig = {
          ...newSettings,
          onInit: () => {
            setTimeout(postInit)
          },
          container: containerRef.current?.firstChild?.firstChild as HTMLElement
        }
        slider.current = tns(settings)
      },
      [postInit, children]
    )

    useEffect(() => {
      build(props)
      return () => {
        if (slider.current && slider.current.destroy) slider.current.destroy()
      }
    }, [props, children])

    /**
     * This hack fixes tiny-slider's problem with container ref.
     * When rendered traditionally, containerRef reference will be overwritten by tiny-slider
     */
    const markup = renderToStaticMarkup(
      <div>
        <div>{children}</div>
      </div>
    )

    return (
      <div
        onClick={clickHandler}
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    )
  }
)
