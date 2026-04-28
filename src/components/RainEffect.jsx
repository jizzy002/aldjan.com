import { useMemo } from 'react';

export default function RainEffect({ isDark = true }) {
  const lineColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const dropColor = isDark ? '#ffffff' : '#000000';

  // Generate responsive grid based on screen size
  const { verticalLines, horizontalLines } = useMemo(() => {
    if (typeof window === 'undefined') {
      return { verticalLines: [], horizontalLines: [] };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Responsive line counts
    let verticalCount = 12;
    let horizontalCount = 8;

    if (width < 768) {
      // Mobile: smaller grid
      verticalCount = 6;
      horizontalCount = 4;
    } else if (width < 1200) {
      // Tablet: medium grid
      verticalCount = 9;
      horizontalCount = 6;
    }

    const vertical = Array.from({ length: verticalCount }, (_, i) => ({
      id: `v-${i}`,
      delay: Math.random() * 10,
      marginLeft: (i / verticalCount) * 100,
      fromTop: Math.random() > 0.5,
      opacity: Math.random() * 0.4 + 0.2
    }));

    const horizontal = Array.from({ length: horizontalCount }, (_, i) => ({
      id: `h-${i}`,
      delay: Math.random() * 10,
      marginTop: (i / horizontalCount) * 100,
      fromLeft: Math.random() > 0.5,
      opacity: Math.random() * 0.4 + 0.2
    }));

    return { verticalLines: vertical, horizontalLines: horizontal };
  }, []);

  return (
    <>
      <style>{`
        .rain-lines-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          width: 100%;
          pointer-events: none;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 100vw;
        }

        .rain-lines-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* Vertical lines - falling from top or bottom */
        .rain-line-vertical-down::after {
          content: '';
          display: block;
          position: absolute;
          height: 15vh;
          width: 100%;
          top: -50%;
          left: 0;
          background: linear-gradient(to bottom, rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, 0) 0%, ${dropColor} 75%, ${dropColor} 100%);
          animation: rainDropVertical 12s infinite forwards;
          animation-timing-function: cubic-bezier(0.4, 0.26, 0, 0.97);
        }

        .rain-line-vertical-up::after {
          content: '';
          display: block;
          position: absolute;
          height: 15vh;
          width: 100%;
          bottom: -50%;
          left: 0;
          background: linear-gradient(to top, rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, 0) 0%, ${dropColor} 75%, ${dropColor} 100%);
          animation: rainDropVerticalUp 12s infinite forwards;
          animation-timing-function: cubic-bezier(0.4, 0.26, 0, 0.97);
        }

        .rain-line-vertical {
          position: absolute;
          width: 1px;
          height: 100%;
          background: ${lineColor};
          overflow: hidden;
        }

        /* Horizontal lines - falling from left or right */
        .rain-line-horizontal-right::after {
          content: '';
          display: block;
          position: absolute;
          width: 15vw;
          height: 100%;
          left: -50%;
          top: 0;
          background: linear-gradient(to right, rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, 0) 0%, ${dropColor} 75%, ${dropColor} 100%);
          animation: rainDropHorizontal 12s infinite forwards;
          animation-timing-function: cubic-bezier(0.4, 0.26, 0, 0.97);
        }

        .rain-line-horizontal-left::after {
          content: '';
          display: block;
          position: absolute;
          width: 15vw;
          height: 100%;
          right: -50%;
          top: 0;
          background: linear-gradient(to left, rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, 0) 0%, ${dropColor} 75%, ${dropColor} 100%);
          animation: rainDropHorizontalLeft 12s infinite forwards;
          animation-timing-function: cubic-bezier(0.4, 0.26, 0, 0.97);
        }

        .rain-line-horizontal {
          position: absolute;
          width: 100%;
          height: 1px;
          background: ${lineColor};
          overflow: hidden;
        }

        @keyframes rainDropVertical {
          0% {
            top: -50%;
          }
          100% {
            top: 110%;
          }
        }

        @keyframes rainDropVerticalUp {
          0% {
            bottom: -50%;
          }
          100% {
            bottom: 110%;
          }
        }

        @keyframes rainDropHorizontal {
          0% {
            left: -50%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes rainDropHorizontalLeft {
          0% {
            right: -50%;
          }
          100% {
            right: 100%;
          }
        }
      `}</style>

      <div className="rain-lines-container">
        <div className="rain-lines-inner">
          {/* Vertical falling lines */}
          {verticalLines.map((line) => (
            <div
              key={line.id}
              className={`rain-line-vertical ${line.fromTop ? 'rain-line-vertical-down' : 'rain-line-vertical-up'}`}
              style={{
                left: `${line.marginLeft}%`,
                opacity: line.opacity,
                top: line.fromTop ? 0 : 'auto',
                bottom: !line.fromTop ? 0 : 'auto'
              }}
            >
              <div style={{ animation: `${line.fromTop ? 'rainDropVertical' : 'rainDropVerticalUp'} 12s infinite forwards ${line.delay}s` }}></div>
            </div>
          ))}

          {/* Horizontal moving lines */}
          {horizontalLines.map((line) => (
            <div
              key={line.id}
              className={`rain-line-horizontal ${line.fromLeft ? 'rain-line-horizontal-right' : 'rain-line-horizontal-left'}`}
              style={{
                top: `${line.marginTop}%`,
                opacity: line.opacity,
                left: line.fromLeft ? 0 : 'auto',
                right: !line.fromLeft ? 0 : 'auto'
              }}
            >
              <div style={{ animation: `${line.fromLeft ? 'rainDropHorizontal' : 'rainDropHorizontalLeft'} 12s infinite forwards ${line.delay}s` }}></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
