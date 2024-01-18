import React from 'react'
import Modal from './Modal'

function Mymap() {
    
  return (
    <div style={{width:'52cm', height:'52cm',backgroundColor:'red', display: "flex", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', borderRadius: '5px'}}>
        {Array.from(Array(27040), (_, i)=><div key={i} style={{width:'0.1cm', height:'0.1cm', backgroundColor: 'purple', zIndex: '10', marginLeft: '2px', marginRight: '2px', marginTop: '2px'}}></div>)}
      <Modal />
    </div>
  )
}

export default Mymap
