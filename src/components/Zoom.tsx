import Image from 'next/image';
import { useState, useEffect } from 'react';

const Modal = ({ imageSrc, onClose }: { imageSrc: string; onClose: () => void }) => {
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [zoomedArea, setZoomedArea] = useState({ top: 0, left: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [resultStyle, setResultStyle] = useState({ backgroundPosition: '0px 0px' });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    setShowCloseButton(true);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLImageElement>) => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoomedArea({ top: y, left: x });

    // Ajuster la position de fond pour le résultat
    const zoomFactor = 1.5; // Ajuster le facteur de zoom
    const backgroundX = -x * zoomFactor + 50; // Ajuster le décalage pour centrer l'image
    const backgroundY = -y * zoomFactor + 50; // Ajuster le décalage pour centrer l'image
    setResultStyle({ backgroundPosition: `${backgroundX}px ${backgroundY}px` });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50" onClick={onClose}>
      <div className="fixed inset-0 bg-black opacity-60"></div>
      <div className="z-50 p-1 bg-white rounded-lg shadow-lg relative text-center" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <div className='cursor-zoom-in'>
            <div>
              <Image
                src={imageSrc}
                alt="Image en grand"
                width={400}
                height={0}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              />
              {isZoomed && (
                <div
                  style={{
                    position: 'absolute',
                    top: `${zoomedArea.top - 50}px`,
                    left: `${zoomedArea.left - 50}px`,
                    width: '200px',
                    height: '200px',
                    borderRadius: '5px',
                    pointerEvents: 'none',
                  }}
                ></div>
              )}
            </div>
          </div>
          {showCloseButton && (
            <div className="absolute top-2 right-2 cursor-pointer" onMouseDown={handleMouseLeave}>
              <Image alt="img-close" src="/close-icon.svg" width={32} height={32} onClick={onClose} />
            </div>
          )}
        </div>
      </div>
      <div className='z-50 p-5 rounded-lg max-xl:hidden'>
        {isZoomed && (
          <div className='border-4 rounded-lg' style={{ width: '300px', height: '300px', background: `url(${imageSrc})`, ...resultStyle }}></div>
        )}
      </div>
    </div>
  );
};

export default Modal;
