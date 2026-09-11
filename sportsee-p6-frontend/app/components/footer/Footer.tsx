import React from "react";
import Logo from "@/app/components/logo/logo";
import '../../styles/styles.css';

export default function Footer() {
  return (
    <footer className="bg-white text-black flex justify-between py-2.5 px-24 text-center">
      <p className="text-sm font-light">
        © {new Date().getFullYear()} Sportsee Tous droits réservés
      </p>

      <div className="flex gap-4">
        <div className="flex gap-4">
          <p>Conditions générales</p>
          <p>Contact</p>
        </div>

        {/* Conteneur du logo */}
        <div className=" flex items-center justify-center">
         <div className="w-5 h-5 flex items-center justify-center">
            <svg
              viewBox="0 0 220 220"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Logo barres dégradées"
            >
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B6B" />
                  <stop offset="45%" stopColor="#FF6B6B" />
                  <stop offset="70%" stopColor="#7D6CFF" />
                  <stop offset="100%" stopColor="#4F67FF" />
                </linearGradient>

                <linearGradient id="bottomGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6A78FF" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#6A78FF" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="topSheen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
                  <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>

                <filter
                  id="softShadow"
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="180%"
                >
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dy="1" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.25" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g transform="translate(30,20)" filter="url(#softShadow)">
                <g transform="translate(0,0)">
                  <rect
                    x="0"
                    y="30"
                    width="28"
                    height="120"
                    rx="14"
                    fill="url(#barGrad)"
                  />
                  <rect
                    x="0"
                    y="130"
                    width="28"
                    height="22"
                    rx="11"
                    fill="url(#bottomGlow)"
                  />
                  <rect
                    x="0"
                    y="30"
                    width="28"
                    height="26"
                    rx="13"
                    fill="url(#topSheen)"
                  />
                </g>

                <g transform="translate(38,0)">
                  <rect
                    x="0"
                    y="10"
                    width="28"
                    height="160"
                    rx="14"
                    fill="url(#barGrad)"
                  />
                  <rect
                    x="0"
                    y="140"
                    width="28"
                    height="28"
                    rx="11"
                    fill="url(#bottomGlow)"
                  />
                  <rect
                    x="0"
                    y="10"
                    width="28"
                    height="26"
                    rx="13"
                    fill="url(#topSheen)"
                  />
                </g>

                <g transform="translate(76,0)">
                  <rect
                    x="0"
                    y="22"
                    width="28"
                    height="140"
                    rx="14"
                    fill="url(#barGrad)"
                  />
                  <rect
                    x="0"
                    y="128"
                    width="28"
                    height="24"
                    rx="11"
                    fill="url(#bottomGlow)"
                  />
                  <rect
                    x="0"
                    y="22"
                    width="28"
                    height="26"
                    rx="13"
                    fill="url(#topSheen)"
                  />
                </g>

                <g transform="translate(114,0)">
                  <rect
                    x="0"
                    y="0"
                    width="28"
                    height="170"
                    rx="14"
                    fill="url(#barGrad)"
                  />
                  <rect
                    x="0"
                    y="146"
                    width="28"
                    height="30"
                    rx="11"
                    fill="url(#bottomGlow)"
                  />
                  <rect
                    x="0"
                    y="0"
                    width="28"
                    height="26"
                    rx="13"
                    fill="url(#topSheen)"
                  />
                </g>

                <g transform="translate(152,0)">
                  <rect
                    x="0"
                    y="14"
                    width="28"
                    height="152"
                    rx="14"
                    fill="url(#barGrad)"
                  />
                  <rect
                    x="0"
                    y="132"
                    width="28"
                    height="26"
                    rx="11"
                    fill="url(#bottomGlow)"
                  />
                  <rect
                    x="0"
                    y="14"
                    width="28"
                    height="26"
                    rx="13"
                    fill="url(#topSheen)"
                  />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
