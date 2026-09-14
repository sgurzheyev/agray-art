"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function subscribeStandalone(cb: () => void) {
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", cb);
  window.addEventListener("appinstalled", cb);
  return () => {
    mq.removeEventListener("change", cb);
    window.removeEventListener("appinstalled", cb);
  };
}

export function InstallButton({ className }: { className?: string }) {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const installed = useSyncExternalStore(
    subscribeStandalone,
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false,
  );

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (installed || !event) return null;

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await event.prompt();
        await event.userChoice;
        setEvent(null);
      }}
    >
      <Download className="size-4" strokeWidth={1.5} />
      Установить
    </button>
  );
}
