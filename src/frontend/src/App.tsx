import ReactIcon from "../assets/React-icon.webp";


import { EducaChainView } from "./views";

function App() {

  const logoStyle = {
    animation: "logo-spin 60s linear infinite",
  };

  return (
    <>
      <style>
        {`
          @keyframes logo-spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div className="flex min-h-screen items-center justify-center bg-gray-800 text-white">
        <div className="mx-auto w-full max-w-4xl space-y-8 p-8 text-center">
          <div className="mb-8">
            <a href="https://reactjs.org" target="_blank" rel="noreferrer">
              <img
                src={ReactIcon}
                className="mx-auto h-24 p-6 will-change-[filter] hover:drop-shadow-[0_0_2em_#61dafbaa] motion-reduce:animate-none"
                style={logoStyle}
                alt="React logo"
              />
            </a>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Vibe Coding Template</h1>
            <h2 className="text-xl">React + Motoko + Internet Computer</h2>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* EducaChain Section */}
            <EducaChainView />
          </div>

          {/* Loading and Error States */}
        </div>
      </div>
    </>
  );
}

export default App;
