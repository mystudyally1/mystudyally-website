import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className="mx-auto max-w-container p-10">
      <h1 className="text-d-6xl">Curriculum-matched tutoring</h1>
      <p className="mt-4 text-md text-muted">Body text in muted grey.</p>
      <a href="#" className="mt-4 inline-block text-md">A link, in blue</a>
      <button className="mt-6 block rounded-2xl bg-primary px-6 py-3.5 text-md font-extrabold text-white shadow-press active:translate-y-1 active:shadow-none">
        Submit an inquiry
      </button>
    </main>
  );
}