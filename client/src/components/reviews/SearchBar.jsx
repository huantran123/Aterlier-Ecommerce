import React, {useState} from 'react';
import { FaSistrix } from "react-icons/fa";
import {IconContext} from 'react-icons';

const SearchBar = (props) => {
  return (
    <>
      <input
        className="rev-search"
        type="text"
        aira-label="Search"
        onChange={(e) => props.handleSearch(e.target.value)} value={props.keyWords}
      />

      <IconContext.Provider value={{style: {marginTop: "2px"}}} >
        <FaSistrix/>
      </IconContext.Provider>
    </>
  )
}

export default SearchBar;
