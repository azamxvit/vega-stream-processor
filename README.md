# Vega Stream Processor

![Status](https://img.shields.io/badge/status-completed-success)
![Tech](https://img.shields.io/badge/stack-React_18_|_TypeScript_|_Vite_|_Tailwind_v4-blue)

A professional implementation of the "AI Explore" frontend challenge. This application emulates Server-Sent Events (SSE) data streaming from an LLM, parses Markdown responses in real-time, and renders **Vega-Lite** charts automatically as soon as a valid specification is detected.

## 🚀 Key Features

* **Smart Streaming Engine**: Emulates network latency (50-150ms) to create a realistic text generation effect.
* **Resilient Parser**: A robust parser that extracts JSON from Markdown code blocks. The application handles partial or malformed JSON chunks gracefully without crashing.
* **Live Visualization**: Charts are rendered automatically using `vega-embed`.
* **Type Safety**: Strict TypeScript implementation with **no `any` types**.
* **Responsive UI**: Modern interface built with Tailwind CSS v4, featuring smooth animations and clear state indicators.

## 🛠 Tech Stack

* **Core**: React 18, TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS v4, Lucide React (Icons)
* **Visualization**: Vega-Embed, Vega-Lite
* **Markdown Processing**: React-Markdown, Remark-GFM

## ⚙️ Getting Started

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/azamxvit/vega-stream-processor.git](https://github.com/azamxvit/vega-stream-processor.git)
    cd vega-stream-processor
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    # or npm install
    ```

3.  **Start the development server**
    ```bash
    pnpm dev
    ```

4.  **How to test**
    * Open `http://localhost:5173`.
    * Click the **"Upload Dump"** button.
    * Select the `dump.jsonl` file (located in the root of this repository).
    * Click **Play**.

## 🏗 Architecture & Decisions

* **`useStream` Hook**: Encapsulates the SSE event processing logic, strictly decoupling business logic from the UI components.
* **`extractAndValidateVega` Parser**: Utilizes regex to locate JSON blocks within Markdown and implements safe `JSON.parse`. It returns a typed `TopLevelSpec` only when validation succeeds.
* **`VegaChart` Component**: An isolated wrapper around `vega-embed` that handles the chart lifecycle (mount/unmount) and error boundaries.
* **Type-Only Imports**: Utilized throughout the project to optimize the build process and ensure clean dependency graphs.

## 🎥 Demo

[Link to Video Demo]