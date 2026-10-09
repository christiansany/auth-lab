# Auth lab

The exercise app for the course evening on authentication in Next.js. Each exercise starts on its own branch, and the slides tell you which one. You need Node 24 or newer.

Every exercise also has a solution branch: the name of the exercise branch with `-solution` at the end, for example `passwords-solution`. Look at it on GitHub or switch to it when you are stuck. The solution of one exercise is also where the next exercise starts.

```bash
npm ci
npm run dev
```

Then open <http://localhost:3000>. The dev server picks up your code changes on its own. To run the app as a production build instead, run `npm run build` and then `npm start`.

The app keeps its data in `data/notes.db`. To start over with the original notes, stop the server and run `npm run reset`.
