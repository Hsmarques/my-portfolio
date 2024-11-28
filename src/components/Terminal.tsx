import { createSignal, onMount, Show } from "solid-js";

interface TerminalProps {
  text: string;
  typingSpeed?: number;
  preText?: string;
}

interface CommandResponse {
  output: string;
  error?: boolean;
}

export default function Terminal(props: TerminalProps) {
  const [displayedText, setDisplayedText] = createSignal("");
  const [showCursor, setShowCursor] = createSignal(true);
  const [isTypingDone, setIsTypingDone] = createSignal(false);
  const [userInput, setUserInput] = createSignal("");
  const [commandHistory, setCommandHistory] = createSignal<string[]>([]);
  const [historyIndex, setHistoryIndex] = createSignal(-1);
  const [commandOutput, setCommandOutput] = createSignal<CommandResponse | null>(null);
  let inputRef: HTMLDivElement | undefined;

  onMount(() => {
    let currentIndex = 0;

    // Type out the text
    const typeInterval = setInterval(() => {
      if (currentIndex < props.text.length) {
        setDisplayedText(props.text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTypingDone(true);
        inputRef?.focus();
      }
    }, props.typingSpeed || 1);

    // Blink the cursor
    setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
  });

  const getLocation = async (): Promise<CommandResponse> => {
    try {
      // First check if geolocation is supported
      if (!navigator.geolocation) {
        return {
          output: "Geolocation is not supported by your browser",
          error: true
        };
      }

      setCommandOutput({ output: "Requesting location permissions..." });

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      return {
        output: `📍 Location found:\nLatitude: ${position.coords.latitude.toFixed(6)}\nLongitude: ${position.coords.longitude.toFixed(6)}`
      };
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            return {
              output: "Location access denied. Please enable location permissions in your browser settings.",
              error: true
            };
          case error.POSITION_UNAVAILABLE:
            return {
              output: "Location information is unavailable at this time.",
              error: true
            };
          case error.TIMEOUT:
            return {
              output: "Location request timed out. Please try again.",
              error: true
            };
        }
      }
      return {
        output: "An error occurred while getting your location.",
        error: true
      };
    }
  };

  const handleCommand = async () => {
    const input = userInput().trim();
    if (input) {
      setCommandHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);

      const [command, ...args] = input.toLowerCase().split(" ");
      let response: CommandResponse | null = null;

      switch (command) {
        case "speak":
          const text = args.join(" ");
          if (text) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
            response = { output: "Speaking text..." };
          }
          break;

        case "location":
          response = await getLocation();
          break;

        case "help":
          response = {
            output: `Available commands:
speak <text> - Speaks the provided text
location - Shows your current location
help - Shows this help message`
          };
          break;

        default:
          response = { output: `Command not found: ${command}. Type 'help' for available commands.`, error: true };
      }

      setCommandOutput(response);
    }

    if (inputRef) inputRef.textContent = "";
    setUserInput("");
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLDivElement }) => {
    setUserInput(e.currentTarget.textContent || "");
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const history = commandHistory();
      if (history.length > 0) {
        const newIndex =
          historyIndex() === -1
            ? history.length - 1
            : Math.max(0, historyIndex() - 1);
        setHistoryIndex(newIndex);
        if (inputRef) {
          inputRef.textContent = history[newIndex];
          setUserInput(history[newIndex]);
          // Move cursor to end of input
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(inputRef);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const history = commandHistory();
      if (historyIndex() !== -1) {
        const newIndex = historyIndex() + 1;
        if (newIndex < history.length) {
          setHistoryIndex(newIndex);
          if (inputRef) {
            inputRef.textContent = history[newIndex];
            setUserInput(history[newIndex]);
          }
        } else {
          setHistoryIndex(-1);
          if (inputRef) {
            inputRef.textContent = "";
            setUserInput("");
          }
        }
      }
    }
  };

  return (
    <div class="bg-black text-green-500 p-4 rounded-lg font-mono text-left w-full max-w-2xl mx-auto relative">
      <div class="flex justify-between items-center">
        <div class="flex">
          <span class="text-red-500">●</span>
          <span class="text-yellow-500 ml-2">●</span>
          <span class="text-green-500 ml-2">●</span>
        </div>
      </div>
      <div class="mt-2 whitespace-pre-wrap break-words">
        {props.preText && <div class="text-center">{props.preText}</div>}
        <span>{displayedText()}</span>
        {!isTypingDone() && (
          <span class={`${showCursor() ? "opacity-100" : "opacity-0"}`}>▋</span>
        )}

        {/* Show command history and outputs */}
        {commandHistory().map((cmd, index) => (
          <div class="mt-2">
            <div>
              <span class="mr-2">$</span>
              <span>{cmd}</span>
            </div>
            {index === commandHistory().length - 1 && commandOutput() && (
              <div class={`ml-4 ${commandOutput()?.error ? 'text-red-500' : ''}`}>
                {commandOutput()?.output}
              </div>
            )}
          </div>
        ))}
      </div>
      {isTypingDone() && (
        <div class="mt-2 flex items-center">
          <span class="mr-2">$</span>
          <div
            ref={inputRef}
            class="flex-1 whitespace-pre-wrap break-words outline-none"
            contentEditable={true}
            onInput={handleInput}
            onKeyDown={handleKeyPress}
          ></div>
        </div>
      )}
    </div>
  );
}
