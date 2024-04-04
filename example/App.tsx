import { useRef, useState } from 'react'
import { TinySlider } from '../src'

const blocks = ['test1', 'test2', 'test3', 'test4']
const blocks2 = ['1', '2', '3', '4', '5', '6', '7']

const App = () => {
  const carousel = useRef(null)
  const carousel2 = useRef(null)
  const [currentBlocks, setCurrentBlocks] = useState(blocks2)

  const responsive = {
    '800': {
      items: 3
    },
    '1200': {
      items: 4
    }
  }

  return (
    <div>
      <div onClick={() => setCurrentBlocks(blocks)}>Blocks 1</div>
      <div onClick={() => setCurrentBlocks(blocks2)}>Blocks 2</div>

      <TinySlider
        responsive={responsive}
        swipeAngle={false}
        items={3}
        mouseDrag
        ref={carousel}
        controls={false}
        nav={false}
        onClick={(slideIndex, info, event) => {
          console.log(slideIndex, info, event)
        }}
      >
        {currentBlocks.map((block, i) => (
          <div
            key={i}
            className={'tns-item'}
            style={{ height: 100, backgroundColor: 'lightgray' }}
          >
            <div className={'slide'}>{block}</div>
          </div>
        ))}
      </TinySlider>

      <TinySlider
        responsive={responsive}
        swipeAngle={false}
        items={3}
        mouseDrag
        ref={carousel2}
        controls={false}
        nav={false}
        onClick={(slideIndex, info, event) => {
          console.log(slideIndex, info, event)
        }}
      >
        {blocks.map((block, i) => {
          return (
            <div
              key={i}
              className={'tns-item'}
              style={{ height: 100, backgroundColor: 'lightgray' }}
            >
              <div className={'slide'}>{block}</div>
            </div>
          )
        })}
      </TinySlider>
    </div>
  )
}

export default App
