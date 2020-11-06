// @ts-nocheck
import React, { useRef, useState } from 'react'

import Carousel from 'react-tiny-slider'
import 'react-tiny-slider/dist/index.css'

const blocks = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6']
const blocks2 = ['test7', 'test8', 'test9', 'test10', 'test11', 'test12']


const App = () => {
  // @ts-ignore

  const carousel = useRef(null)
  const [currentBlocks,setCurrentBlocks] = useState(blocks)
  const [renderCarousel,setRenderCarousel] = useState(true)

  const next = () => {
    // @ts-ignore
    carousel.current?.goTo('next')
  }

  return (
    <div>
      <div onClick={() => next()}>NEXT</div>
      <div onClick={() => next()}>PREV</div>
      <div onClick={() => setCurrentBlocks(blocks)}>UPDATE 1</div>
      <div onClick={() => setCurrentBlocks(blocks2)}>UPDATE 2</div>
      <div onClick={() => setRenderCarousel(false)}>DESTROY</div>

      {renderCarousel && <Carousel loop={false} items={4} mouseDrag ref={carousel} controls={false}>
        {currentBlocks.map(block =>{
          return <div style={{ height: 100, backgroundColor: 'lightgray' }} key={block}> {block} </div>
        })}
      </Carousel>}


    </div>
  )
}

export default App
