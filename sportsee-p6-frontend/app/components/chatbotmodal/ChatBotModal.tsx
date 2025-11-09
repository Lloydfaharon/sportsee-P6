const handleSend = async () => {
  if (!input.trim()) return;

  setMessages([...messages, { sender: "user", text: input }]);
  const userInput = input;
  setInput("");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await res.json();
    if (data.reply) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Désolé, je n’ai pas compris 🤔" },
      ]);
    }
  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Erreur de connexion au serveur 😕" },
    ]);
  }
};
