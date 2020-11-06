// @ts-nocheck
import React, { useRef, useState } from 'react'

import Carousel from 'react-tiny-slider'

const blocks = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6']
const blocks2 = ['test7', 'test8', 'test9', 'test10', 'test11', 'test12']


const App = () => {

  const carousel = useRef(null)
  const [currentBlocks,setCurrentBlocks] = useState(blocks)

  const next = () => {
    carousel.current?.goTo('next')
  }

  return (
    <div>
      <div onClick={() => next()}>NEXT</div>
      <div onClick={() => next()}>PREV</div>
      <div onClick={() => setCurrentBlocks(blocks)}>UPDATE 1</div>
      <div onClick={() => setCurrentBlocks(blocks2)}>UPDATE 2</div>

      <Carousel swipeAngle={false} loop={true} mode={'carousel'} items={3} mouseDrag ref={carousel} controls={false}>
        {currentBlocks.map(block =>{
          return <div className={'tns-item'} style={{ height: 100, backgroundColor: 'lightgray' }} key={block}> <div className={'slide'}>{block}</div> </div>
        })}
      </Carousel>

    </div>
  )
}

export default App
