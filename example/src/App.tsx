import React, { useRef, useState } from 'react'
import Carousel from 'react-tiny-slider'

const blocks = ['test1', 'test2', 'test3', 'test4']
const blocks2 = ['1', '2', '3', '4', '5', '6', '7']

const App = () => {

  const carousel = useRef(null)
  const [currentBlocks, setCurrentBlocks] = useState(blocks2)

  const response = {
    '800': {
      'items': 3
    },
    '1200': {
      'items': 4
    }
  }

  return (
    <div>
      <div onClick={() => setCurrentBlocks(blocks)}>Blocks 1</div>
      <div onClick={() => setCurrentBlocks(blocks2)}>Blocks 2</div>

      <Carousel
        responsive={response}
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
        {currentBlocks.map((block) => {
          return <div
            className={'tns-item'}
            style={{ height: 100, backgroundColor: 'lightgray' }}
          >
            <div className={'slide'}>{block}</div>
          </div>
        })}
      </Carousel>

    </div>
  )
}

export default App
