import Terminal from "~/components/Terminal";

export default function Home() {
  return (
    <main class="text-center mx-auto text-gray-400 p-4">
      <Terminal
        preText={`
 _    _      _ _       _
| |  | |    | | |     | |
| |__| | ___| | | ___ | |
|  __  |/ _ \\ | |/ _ \\| |
| |  | |  __/ | | (_) |_|
|_|  |_|\\___|_|_|\\___/(_)

`}
        text="Welcome to my page! I'm Hugo, a developer from Portugal. And this is still a work in progress 🚧 👷‍♂️"
        typingSpeed={50}
      />
    </main>
  );
}
