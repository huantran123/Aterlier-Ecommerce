import React from 'react'
import { useRef, useState } from "react";
import styled from "styled-components";

const Container = styled.div``;

const Image = styled.img.attrs((props) => ({
  src: props.source
}))``;

const Source = styled(Image)``;

const Target = styled(Image)``;

const MaxZoomView = (props) => {
  const sourceRef = useRef(null);
  const targetRef = useRef(null);
  const containerRef = useRef(null);

  const [opacity, setOpacity] = useState(1);
  const [offset, setOffset] = useState({ left: 0, top: 0 });

  const handleMouseMove = (e) => {
    const targetRect = targetRef.current.getBoundingClientRect();
    const sourceRect = sourceRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const xRatio = (targetRect.width - containerRect.width) / sourceRect.width;
    const yRatio = (targetRect.height - containerRect.height) / sourceRect.height;

    const left = Math.max(Math.min(e.pageX - sourceRect.left, sourceRect.width), 0);
    
    const top = Math.max(Math.min(e.pageY - sourceRect.top, sourceRect.height), 0);

    setOffset({
      left: left * -xRatio,
      top: top * -yRatio
    });
  };

  return (
      <Container
        className='minus-cursor'
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onClick={props.toggleZoom}
        style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'block',
          height: '600px',
          flexGrow: 1,
          width: '100%',
        }}
        role='max-zoom-picture'
      >
        <Source
          ref={sourceRef}
          alt="source"
          source={props.photos[props.selectedPhotoIndex]}
          style={{
            width:'100%',
            height:'600px',
            objectFit:'contain',
            opacity: 0,
          }} 
        />
        <Target
          ref={targetRef}
          alt="target"
          opacity={opacity}
          offset={offset}
          source={props.photos[props.selectedPhotoIndex]}
          style={{
            left: `${offset.left}px`,
            top: `${offset.top}px`,
            opacity: opacity,
            position: 'absolute',
            width:'250%',
            height: 'auto'
            // height:'1500px',
            // objectFit:'contain',
          }}
        />
      </Container>
  );
}

export default MaxZoomView
