# Mixgit

**Git-style version control and AI code review for MIT Scratch & more.**

Mixgit is a full-stack web app that brings collaboration, version history, and beginner-friendly code review to [Scratch](https://scratch.mit.edu/) block coding. Students share their work as **Remixes** (an approachable take on branches and pull requests), and Claude AI reads the underlying Scratch logic to give plain-language feedback.

**Live demo:** https://mixgit.tech/

> Built with Next.js, React, TypeScript, MongoDB, Better Auth, and the Anthropic Claude API.

## Features

- **Projects & Remixes:** every project starts from a `main` remix. Students upload new versions as Remixes, a student-friendly abstraction of branches and pull requests.
- **Scratch block parser:** reconstructs full program structure from a Scratch `.sb3`'s `project.json`.
- **Scratch block rendering:** parsed scripts are displayed as readable, indented block stacks in the UI.
- **AI code review:** Claude reads the parsed program and returns friendly, structured feedback (what works well, suggestions, logic issues), tuned for 5th–8th-grade readers.
- **Teams & sharing:** invite collaborators to a project and view shared-projects.
- **Auth & accounts:** email/password auth, sessions with 30-day "remember me", and customizable profile.
- **Search:** find users and projects, and view remix/project counts.
- **Privacy-conscious uploads:** device-identifiable metadata is stripped from uploaded projects before storage.

## Getting Started ( Dev )

1. Install the project's dependancies.

```bash
npm install
```

2. Make a copy of `.env.example` as `.env` or `.env.local`.

```bash
cp .env.example .env
```

Then acquire the required keys/values to your `.env`.

3. Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
