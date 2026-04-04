import { createSignal } from "solid-js";

export default function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <button
      class="w-[200px] rounded-full bg-bacalhau border-2 border-superbock/30 focus:border-superbock active:border-superbock px-[2rem] py-[1rem] text-vinho-800" 
      onClick={() => setCount(count() + 1)}
    >
      Clicks: {count()}
    </button>
  );
}
