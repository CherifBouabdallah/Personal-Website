/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  const text = "Hello, World!";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F0DF] p-6 text-[#6A994E] transition-colors duration-300 overflow-hidden">
      <main className="text-center">
        <h1
          id="hello-world-title"
          className="font-maghfirea text-[200px] text-[#6A994E] selection:bg-[#6A994E] selection:text-[#F6F0DF] mb-4 flex justify-center"
        >
          {text.split("").map((char, index) => (
            <span
              key={index}
              className="animate-slide-up-fade inline-block"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </main>
    </div>
  );
}
