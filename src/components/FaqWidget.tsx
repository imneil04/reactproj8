"use client"
import { createClient } from "@/lib/supabase/client";
import { useState, useRef, useEffect } from "react";

/**
 * FaqWidget
 * A floating help icon that expands into a small FAQ chat panel.
 * Answers are pulled from a Supabase `faqs` table via keyword matching.
 */

type Message = {
  role: "bot" | "user";
  text: string;
};

type FaqRow = {
  question: string;
  answer: string;
};

const FALLBACK_ANSWER =
  "Sorry, I don't have an answer for that yet. Try asking about saving destinations, filters, or recommendations.";

const supabase = createClient();

async function getAnswer(userInput: string): Promise<string> {
  //split worded questions to access keywords
  const words = userInput.toLowerCase().replace(/[?!.,]/g, "").split(/\s+/);

  const { data, error } = await supabase
    .from("faqs")
    .select("question,answer")
    .overlaps("keywords", words)
    .limit(1)
    .returns<FaqRow[]>();

  //console.log("query result: ", { words, data, error });

  if (error || !data?.length) return FALLBACK_ANSWER;

  return data[0].answer;
}

export default function FaqWidget() {

    //state value, set the current value
    const [ open, setOpen ] = useState(false);
    const [ messages, setMessages ] = useState<Message[]>([
        { role: "bot", text: "Hi there 👋! Ask me anything about using the app." },
    ]);
    const [ input, setInput ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [ suggestions, setSuggestions ] = useState<string[]>([]);

    useEffect(() => {
        async function loadSuggestions() {
        const { data } = await supabase
            .from("faqs")
            .select("question")
            .limit(4)
            .returns<{ question: string }[]>();

        if (data) setSuggestions(data.map((row) => row.question));
        }
        loadSuggestions();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, open]);

    //for question chip
    async function askQuestion(text: string) {
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    const answer = await getAnswer(text);

    setMessages((prev) => [...prev, { role: "bot", text: answer }]);
    setLoading(false);
  }


    async function handleSend(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();
    askQuestion(input.trim());
  }

  return (
    <>
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {open && (
                <div className="w-80 h-[420px] bg-white rounded-xl shadow-xl mb-3 flex flex-col overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="px-4 py-3 bg-emerald-600 text-white flex justify-between items-center">
                        <span className="font-medium text-sm">Virtual - FAQ</span>
                        <button
                        onClick={() => setOpen(false)}
                        aria-label="Close FAQ"
                        className="text-white text-xl leading-none hover:opacity-80"
                        >
                        ×
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-3 flex flex-col gap-2"
                    >
                        {messages.map((m, i) => (
                        <div
                            key={i}
                            className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                            m.role === "user"
                                ? "bg-emerald-600 text-white self-end"
                                : "bg-gray-100 text-gray-900 self-start"
                            }`}
                        >
                            {m.text}
                        </div>
                        ))}
                        {loading && (
                        <div className="max-w-[80%] px-3 py-2 rounded-xl text-sm bg-gray-100 text-gray-900 self-start">
                            Thinking…
                        </div>
                        )}
                    </div>

                    {/**Render the chips */}
                    {suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-3 pb-2">
                            {suggestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => askQuestion(q)}
                                    className="text-xs px-3 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSend} className="flex border-t border-gray-100 p-2 gap-2">
                        <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-emerald-700 disabled:opacity-50"
                        >
                        Send
                        </button>
                    </form>
                </div>
            )}

            {/* Floating action button */}
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close FAQ" : "Open FAQ"}
                className="w-14 h-14 rounded-full bg-emerald-600 text-white text-2xl shadow-lg hover:bg-emerald-700 transition-colors"
            >
                {open ? "×" : "?"}
            </button>
        </div>
    </>
  );

}