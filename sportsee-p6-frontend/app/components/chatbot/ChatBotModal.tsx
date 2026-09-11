"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { motion } from "framer-motion";

type ChatbotModalProps = {
  onClose: () => void;
  userId?: string | number | null;
  userPhoto?: string | null;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatbotModal({
  onClose,
  userId,
  userPhoto,
}: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas quand un message arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, userId: userId ?? null }),
      });

      if (!res.ok) throw new Error("Erreur API");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Désolé, je n’ai pas compris 😅",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Erreur de communication avec le serveur.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const examplePrompts = [
    "Comment améliorer mon endurance ?",
    "Que signifie mon score de récupération ?",
    "Peux-tu m’expliquer mon dernier graphique ?",
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-[10px] shadow-2xl w-[1134px] h-[90vh] flex flex-col overflow-hidden">
        {/* --- Header --- */}
        <div className="flex justify-end items-center px-6 py-4  border-gray-100">
          <button
            onClick={onClose}
            className="text-gray-400 flex text-[12px] items-center hover:text-gray-600 transition"
            aria-label="Fermer"
          >
            Fermer
            <X size={17} />
          </button>
        </div>

        {/* --- Messages --- */}
        <div className="flex-1 overflow-y-auto px-45 space-y-4 bg-white">
          {/* Message d'accueil */}
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-start pt-[60px] text-center text-blue-700 text-xl font-medium">
              Posez vos questions sur votre programme,
              <br />
              vos performances ou vos objectifs.
            </div>
          )}

          <div className="flex  flex-col gap-4 mt-6">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-end gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar gauche pour l'assistant */}
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-red-600 items-center flex justify-center ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      fill="none"
                    >
                      <path
                        d="M5.85961 4.36917C6.03709 3.79065 6.85605 3.79065 7.03353 4.36917L7.86444 7.07768C7.92418 7.27241 8.07661 7.42483 8.27134 7.48457L10.9798 8.31548C11.5584 8.49296 11.5584 9.31193 10.9798 9.4894L8.27134 10.3203C8.07661 10.3801 7.92418 10.5325 7.86444 10.7272L7.03353 13.4357C6.85605 14.0142 6.03709 14.0142 5.85961 13.4357L5.0287 10.7272C4.96896 10.5325 4.81654 10.3801 4.62181 10.3203L1.9133 9.4894C1.33478 9.31193 1.33478 8.49296 1.9133 8.31548L4.62181 7.48457C4.81654 7.42483 4.96896 7.27241 5.0287 7.07768L5.85961 4.36917Z"
                        fill="#FCC1B6"
                      />
                      <path
                        d="M10.8274 0.728877C10.8951 0.508487 11.207 0.508487 11.2747 0.728877L11.5912 1.76069C11.614 1.83487 11.672 1.89294 11.7462 1.9157L12.778 2.23223C12.9984 2.29984 12.9984 2.61183 12.778 2.67944L11.7462 2.99598C11.672 3.01874 11.614 3.0768 11.5912 3.15099L11.2747 4.1828C11.207 4.40319 10.8951 4.40319 10.8274 4.1828L10.5109 3.15099C10.4882 3.0768 10.4301 3.01874 10.3559 2.99598L9.32409 2.67944C9.1037 2.61183 9.1037 2.29984 9.32409 2.23223L10.3559 1.9157C10.4301 1.89294 10.4882 1.83487 10.5109 1.76069L10.8274 0.728877Z"
                        fill="#FCC1B6"
                      />
                      <path
                        d="M12.2788 11.4395C12.3718 11.1365 12.8007 11.1365 12.8937 11.4395L13.3289 12.8583C13.3602 12.9603 13.4401 13.0401 13.5421 13.0714L14.9608 13.5066C15.2639 13.5996 15.2639 14.0286 14.9608 14.1215L13.5421 14.5568C13.4401 14.5881 13.3602 14.6679 13.3289 14.7699L12.8937 16.1887C12.8007 16.4917 12.3718 16.4917 12.2788 16.1887L11.8436 14.7699C11.8123 14.6679 11.7324 14.5881 11.6304 14.5568L10.2117 14.1215C9.90864 14.0286 9.90864 13.5996 10.2117 13.5066L11.6304 13.0714C11.7324 13.0401 11.8123 12.9603 11.8436 12.8583L12.2788 11.4395Z"
                        fill="#FCC1B6"
                      />
                    </svg>
                  </div>
                )}

                {/* Bulle du message */}
                <div
                  className={`p-3 shadow-md max-w-[80%] text-[15px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-red-100 text-gray-900 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-tl-2xl rounded-tr-2xl rounded-bl-none rounded-br-2xl"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Avatar droite pour l'utilisateur */}
                {msg.role === "user" && (
                  <div className="overflow-hidden rounded-full w-8 h-8 shrink-0">
                    <Image
                      src={
                        typeof userPhoto === "string" && userPhoto.length > 0
                          ? userPhoto
                          : "/images/default-avatar.jpg"
                      }
                      alt="Photo utilisateur"
                      width={32}
                      height={32}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Animation de chargement */}
            {loading && (
              <div className="flex items-center gap-2 ml-2 mt-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.45s]" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                </div>
                <span className="text-sm italic text-gray-500">
                  Coach AI écrit...
                </span>
              </div>
            )}
          </div>

          <div ref={chatEndRef}></div>
        </div>

        {/* --- Zone de saisie --- */}
        <div className=" border-gray-100 bg-white px-25 py-4 flex flex-col space-y-3 mx-20">
          <div className="relative flex flex-col gap-8 bg-white border border-gray-200 rounded-2xl p-2">
            <div className="flex gap-4 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="21"
                viewBox="0 0 19 21"
                fill="none"
              >
                <path
                  d="M6.97444 5.20041C7.18569 4.51182 8.16047 4.51182 8.37171 5.20042L9.36071 8.42423C9.43181 8.65601 9.61324 8.83744 9.84502 8.90854L13.0688 9.89754C13.7574 10.1088 13.7574 11.0836 13.0688 11.2948L9.84502 12.2838C9.61324 12.3549 9.43181 12.5363 9.36071 12.7681L8.37171 15.9919C8.16046 16.6805 7.18569 16.6805 6.97444 15.9919L5.98545 12.7681C5.91434 12.5363 5.73292 12.3549 5.50114 12.2838L2.27732 11.2948C1.58873 11.0836 1.58873 10.1088 2.27732 9.89754L5.50114 8.90854C5.73292 8.83744 5.91434 8.65601 5.98545 8.42423L6.97444 5.20041Z"
                  fill="#FCC1B6"
                />
                <path
                  d="M12.8879 0.86755C12.9684 0.60523 13.3397 0.60523 13.4202 0.867551L13.7969 2.09567C13.824 2.18397 13.8931 2.25308 13.9814 2.28017L15.2096 2.65693C15.4719 2.73741 15.4719 3.10875 15.2096 3.18922L13.9814 3.56598C13.8931 3.59307 13.824 3.66219 13.7969 3.75048L13.4202 4.9786C13.3397 5.24092 12.9684 5.24092 12.8879 4.9786L12.5111 3.75048C12.484 3.66219 12.4149 3.59307 12.3266 3.56598L11.0985 3.18922C10.8362 3.10875 10.8362 2.73741 11.0985 2.65693L12.3266 2.28017C12.4149 2.25308 12.484 2.18397 12.5111 2.09567L12.8879 0.86755Z"
                  fill="#FCC1B6"
                />
                <path
                  d="M14.6147 13.616C14.7254 13.2553 15.236 13.2553 15.3466 13.616L15.8647 15.3046C15.9019 15.4261 15.9969 15.5211 16.1183 15.5583L17.807 16.0764C18.1677 16.187 18.1677 16.6976 17.807 16.8083L16.1183 17.3263C15.9969 17.3636 15.9019 17.4586 15.8647 17.58L15.3466 19.2687C15.236 19.6294 14.7254 19.6294 14.6147 19.2687L14.0967 17.58C14.0594 17.4586 13.9644 17.3636 13.843 17.3263L12.1543 16.8083C11.7936 16.6976 11.7936 16.187 12.1543 16.0764L13.843 15.5583C13.9644 15.5211 14.0594 15.4261 14.0967 15.3046L14.6147 13.616Z"
                  fill="#FCC1B6"
                />
              </svg>
              <p className="text-[#707070] text-sm">
                Comment puis-je vous aider ?
              </p>
            </div>

            <div className="flex mt-2">
              <label htmlFor="user-message" className="sr-only">
                Message
              </label>
              <textarea
                id="user-message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder=""
                rows={1}
                className="flex-1 w-full bg-transparent outline-none resize-none text-gray-700 placeholder-gray-400 px-2 py-1"
              />

              <button
                onClick={handleSend}
                disabled={loading}
                aria-label="Envoyer le message"
                className={`p-2 rounded-lg transition ${
                  loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <i
                  className={`fa-solid fa-arrow-up text-lg transition-transform duration-300 ${
                    loading ? "rotate-45 opacity-50" : "rotate-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Suggestions rapides */}
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInput(prompt)}
                className="px-4 py-2 rounded-lg bg-[#F2F3FF] hover:bg-blue-100 text-gray-700 text-[12px] pt-6 pb-10 transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
