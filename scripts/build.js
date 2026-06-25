import { build } from "vite";

await build({
  configFile: false,
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        todo: "todo.html",
      },
    },
  },
});
