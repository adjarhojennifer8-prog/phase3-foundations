"use client";

import { useState } from "react";
import Modal from "./components/Modal";
import Tabs from "./components/Tabs";
import Disclosure from "./components/Disclosure";

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    {
      id: "one",
      label: "First",
      content: <p>This is the content for the first tab.</p>,
    },
    {
      id: "two",
      label: "Second",
      content: <p>This is the content for the second tab.</p>,
    },
    {
      id: "three",
      label: "Third",
      content: <p>This is the content for the third tab.</p>,
    },
  ];

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Accessible Components Playground</h1>

      <section>
        <h2>Modal Dialog</h2>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Open Modal
        </button>

        <Modal
          isOpen={isModalOpen}
          title="Example Modal"
          onClose={() => setIsModalOpen(false)}
        >
          <p>
            This modal is being tested for keyboard accessibility,
            focus trapping, Escape handling, and focus restoration.
          </p>

          <label>
            Example input
            <input type="text" />
          </label>
        </Modal>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Tabs</h2>

        <Tabs tabs={tabs} />
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Disclosure</h2>

        <Disclosure title="About this component">
          <p>
            This content can be expanded and collapsed using the
            keyboard or a pointer.
          </p>
        </Disclosure>
      </section>
    </main>
  );
}