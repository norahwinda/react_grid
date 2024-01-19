import React from 'react'
import Image from './assets/image.svg'

export default function Modal() {
  return (
    <div style={{width:'49cm', height:'49cm', backgroundColor: 'blue', display: "flex", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', borderRadius: '5px'}}>
      {Array.from(Array(250000), (_, i)=><div key={i} style={{width:'0.1cm', height:'0.1cm', backgroundColor: 'purple', zIndex: '10', marginLeft: '2px', marginRight: '2px', marginTop: '2px'}}></div>)}
      <img src={Image} alt='' style={{width: '49cm', height:'49cm', position: 'absolute'}} />
    </div>
  )
}
