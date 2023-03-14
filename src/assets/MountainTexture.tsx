const MountainTexture = () => {
  return (
    <svg>
      <defs>
        <filter
          id="mountains-turbulence"
          x="0"
          y="0"
          width="100%"
          height="100%"
        >
          <feTurbulence numOctaves="3" baseFrequency="0.06 0.03"></feTurbulence>
          <feDisplacementMap scale="9" in="SourceGraphic"></feDisplacementMap>
        </filter>
        <pattern
          id="mountain-texture-2"
          patternUnits="userSpaceOnUse"
          width="16.5"
          height="32.877"
          patternTransform="scale(0.15)"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="hsla(131, 44%, 43%, 1)"
          />
          <path
            d="M-5 2l5 10L5 2zm16.5 0l5 10 5-10zM8.25 4.438l-5 10h10zm-5 14l5 10.001 5-10zM0 20.878l-5 10H5zm16.5 0l-5 10h10z"
            stroke-width="1"
            stroke="hsla(131, 44%, 36%, 1)"
            fill="none"
          />
        </pattern>
        <pattern
          id="mountain-texture-1"
          patternUnits="userSpaceOnUse"
          width="16.5"
          height="32.877"
          patternTransform="scale(0.15)"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="hsla(97, 41%, 61%, 1)"
          />
          <path
            d="M-5 2l5 10L5 2zm16.5 0l5 10 5-10zM8.25 4.438l-5 10h10zm-5 14l5 10.001 5-10zM0 20.878l-5 10H5zm16.5 0l-5 10h10z"
            stroke-width="1"
            stroke="hsla(96, 34%, 51%, 1)"
            fill="none"
          />
        </pattern>
        <pattern
          id="mountain-texture-3"
          patternUnits="userSpaceOnUse"
          width="16.5"
          height="32.877"
          patternTransform="scale(0.15)"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="hsla(38, 44%, 48%, 1)"
          />
          <path
            d="M-5 2l5 10L5 2zm16.5 0l5 10 5-10zM8.25 4.438l-5 10h10zm-5 14l5 10.001 5-10zM0 20.878l-5 10H5zm16.5 0l-5 10h10z"
            stroke-width="1"
            stroke="hsla(38, 45%, 43%, 1)"
            fill="none"
          />
        </pattern>
      </defs>
    </svg>
  );
};

export default MountainTexture;