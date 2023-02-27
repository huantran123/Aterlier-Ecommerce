import React, { useState } from 'react';
import { calculateSize } from './helper-revs';
import {IconContext} from 'react-icons';
import { IoTriangle } from "react-icons/io5"

const Product = (props) => {
  const [chars, setChars] = useState(props.chars);

  return (
    <div className="breakdown">
      <div className="rat-size">
        {Object.keys(props.chars).map(fact => {
          return (
            <div key={props.chars[fact].id} >
              <div className="small_font">{fact}</div>
              {!props.chars[fact].value ? null :
                <IconContext.Provider value={{className: "point-tria", style: {marginLeft: (Math.round(parseFloat(props.chars[fact].value)-1) * 42)}}}>
                  <IoTriangle />
                </IconContext.Provider>
              }
              {(fact === "Size" || fact === "Length" || fact === "Fit" || fact === "Width") ?
                  <div>
                    <div className="pod-progress pod-long"></div>
                    <br/>
                    <div className="progress xs_font">
                      <div style={{marginRight: "27px", marginLeft:"5px"}}>Too small</div>
                      <div style={{marginRight: "25px"}}>Perfect</div>
                      <div>Too large</div>
                    </div>
                  </div>
                :
                  <div>
                    <div className="pod-progress pod-short"></div><br/>
                    <div className="progress xs_font">
                      <div style={{marginRight: "120px", marginLeft:"5px"}}>poor</div>
                      <div>perfect</div>
                    </div>
                  </div>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Product;
