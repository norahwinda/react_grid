import React from 'react'
import Image from './assets/image.jpg'

export default function Modal() {
  return (
    <div style={{width:'51cm', height:'51cm', borderRadius: '5px', position: 'absolute', backgroundColor: 'blue'}}>
      <img src={Image} alt='' style={{width:'51cm', height:'51cm',}}/>
    </div>
  )
}
