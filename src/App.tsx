/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 p-6 text-stone-900 transition-colors duration-300">
      <main className="max-w-md text-center animate-fade-in">
        <h1 
          id="hello-world-title"
          className="text-5xl font-extrabold tracking-tight sm:text-6xl text-stone-900 selection:bg-amber-100 mb-4"
        >
          Hello, World!
        </h1>
        <p 
          id="hello-world-description"
          className="text-stone-500 font-medium tracking-wide text-sm uppercase"
        >
          Your super simple canvas is ready.
        </p>
      </main>
    </div>
  );
}

