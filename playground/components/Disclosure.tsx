"use client";

import { useId, useState } from "react";

type DisclosureProps = {
  title: string;
  children: React.ReactNode;
};

export default function Disclosure({
  title,
  children,
}: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        onClick={() => setIsOpen((current) => !current)}
      >
        {title}
      </button>

      <div
        id={`${id}-content`}
        hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
}