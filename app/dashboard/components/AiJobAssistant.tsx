"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Job } from "./KanbanBoard";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function AIJobAssistant({ jobs }: { jobs: Job[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! I'm your AI Job Assistant. I can help you:\n• Get insights about your job applications\n• Answer questions about your job search\n• Provide application tips\n\nWhat would you like to know?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getJobStats = () => {
        const total = jobs.length;
        const applied = jobs.filter((j) => j.status === "applied").length;
        const interviewing = jobs.filter((j) => j.status === "interviewing").length;
        const selected = jobs.filter((j) => j.status === "selected").length;
        const rejected = jobs.filter((j) => j.status === "rejected").length;

        return { total, applied, interviewing, selected, rejected };
    };

    const generateResponse = async (userMessage: string): Promise<string> => {
        const stats = getJobStats();
        const lowerMessage = userMessage.toLowerCase();

        // Job statistics queries
        if (lowerMessage.includes("how many") || lowerMessage.includes("stats") || lowerMessage.includes("status")) {
            return `Here's your job application summary:

📊 Total Applications: ${stats.total}
📝 Applied: ${stats.applied}
📞 Interviewing: ${stats.interviewing}
✅ Selected: ${stats.selected}
❌ Rejected: ${stats.rejected}

${stats.interviewing > 0 ? `Great! You have ${stats.interviewing} active interview(s)! 🎉` : ""}
${stats.selected > 0 ? `Congratulations on ${stats.selected} offer(s)! 🎊` : ""}`;
        }

        // Tips and advice
        if (lowerMessage.includes("tip") || lowerMessage.includes("advice") || lowerMessage.includes("help")) {
            const tips = [
                "💡 Follow up with companies 3-5 days after applying to show interest.",
                "💡 Customize your resume for each application - highlight relevant skills.",
                "💡 Research the company before interviews - know their mission and recent news.",
                "💡 Prepare STAR method answers (Situation, Task, Action, Result) for common questions.",
                "💡 Send thank-you emails within 24 hours after interviews.",
                "💡 Keep a spreadsheet of your applications with dates and contacts.",
                "💡 Network on LinkedIn - connect with employees at companies you're interested in.",
            ];
            return tips[Math.floor(Math.random() * tips.length)];
        }

        // Interview preparation
        if (lowerMessage.includes("interview") || lowerMessage.includes("prepare")) {
            return `🎯 Interview Preparation Tips:

1. **Research the Company**: Know their products, mission, and recent news
2. **Practice Common Questions**: "Tell me about yourself", "Why here?", "Your strengths/weaknesses"
3. **Prepare Questions**: Ask about team, projects, growth opportunities
4. **STAR Method**: Structure answers with Situation, Task, Action, Result
5. **Dress Appropriately**: Better to be slightly overdressed
6. **Arrive Early**: 10-15 minutes early shows punctuality

${stats.interviewing > 0 ? `\nYou have ${stats.interviewing} interview(s) coming up. Good luck! 🍀` : ""}`;
        }

        // Resume tips
        if (lowerMessage.includes("resume") || lowerMessage.includes("cv")) {
            return `📄 Resume Tips:

✅ Keep it to 1-2 pages maximum
✅ Use action verbs (Led, Developed, Managed, Created)
✅ Quantify achievements (Increased sales by 25%)
✅ Tailor to each job description
✅ Include relevant keywords from job posting
✅ Proofread multiple times - no typos!
✅ Use a clean, professional template
✅ Add links to portfolio/LinkedIn/GitHub

Remember: Your resume is your marketing document!`;
        }

        // Cover letter
        if (lowerMessage.includes("cover letter")) {
            return `✉️ Cover Letter Tips:

1. **Personalize**: Address to hiring manager by name
2. **Opening**: Hook them with why you're excited
3. **Body**: Match your skills to their needs
4. **Closing**: Call to action - request interview
5. **Length**: Keep it to one page
6. **Tone**: Professional but show personality

Pro tip: Research the company and mention specific projects or values that resonate with you!`;
        }

        // Motivation and encouragement
        if (lowerMessage.includes("discouraged") || lowerMessage.includes("rejected") || lowerMessage.includes("hard")) {
            return `I understand job searching can be tough. Remember:

🌟 Rejection is redirection - the right opportunity is out there
🌟 Every "no" gets you closer to a "yes"
🌟 You've already applied to ${stats.total} job(s) - that's action!
🌟 ${stats.interviewing} interview(s) means you're making progress
🌟 Take breaks when needed - self-care is important

Keep going! Your persistence will pay off. 💪`;
        }

        // General application advice
        if (lowerMessage.includes("apply") || lowerMessage.includes("application")) {
            return `📝 Application Best Practices:

1. **Quality over Quantity**: 5 tailored applications > 20 generic ones
2. **Track Everything**: Use this tool to stay organized!
3. **Follow Up**: Email HR 3-5 days after applying
4. **Use Keywords**: Match job description language
5. **Proofread**: Check for typos in every application
6. **Apply Early**: Don't wait until deadline
7. **Network**: Referrals increase your chances by 5-10x

You're currently tracking ${stats.total} applications - great job staying organized!`;
        }

        // Networking
        if (lowerMessage.includes("network") || lowerMessage.includes("linkedin")) {
            return `🤝 Networking Tips:

1. **LinkedIn Optimization**:
   - Professional photo
   - Compelling headline
   - Detailed experience section
   - Ask for recommendations

2. **Connect Strategically**:
   - Employees at target companies
   - Recruiters in your industry
   - Alumni from your school
   - People at industry events

3. **Engage Authentically**:
   - Comment on posts
   - Share valuable content
   - Send personalized connection requests

Remember: Networking is about building relationships, not just asking for jobs!`;
        }

        // Salary negotiation
        if (lowerMessage.includes("salary") || lowerMessage.includes("negotiate") || lowerMessage.includes("offer")) {
            return `💰 Salary Negotiation Tips:

1. **Do Research**: Use Glassdoor, Levels.fyi, PayScale
2. **Wait for Offer**: Don't discuss numbers until they offer
3. **Be Confident**: "Based on my research and experience, I'm looking for $X-Y"
4. **Consider Total Comp**: Equity, bonus, benefits, PTO
5. **Be Ready to Justify**: Explain your value
6. **Stay Professional**: Even if you decline
7. **Get it in Writing**: Always

${stats.selected > 0 ? `\nCongrats on your ${stats.selected} offer(s)! This is your time to negotiate. 🎉` : ""}`;
        }

        // Default response
        return `I can help you with:

📊 **Job Stats** - "How many jobs have I applied to?"
💡 **Application Tips** - "Give me advice on applying"
🎯 **Interview Prep** - "How do I prepare for interviews?"
📄 **Resume Help** - "Resume tips please"
✉️ **Cover Letters** - "How to write a cover letter?"
💰 **Salary Negotiation** - "Tips for negotiating salary"
🤝 **Networking** - "How to network effectively?"

What would you like to know more about?`;
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        // Simulate thinking delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await generateResponse(userMessage);
        setMessages((prev) => [...prev, { role: "assistant", content: response }]);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-50 group"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>

                    {/* Tooltip */}
                    <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        AI Job Assistant
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">AI Job Assistant</h3>
                                <p className="text-xs text-white/80">Always here to help</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${message.role === "user"
                                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                            : "bg-white border border-gray-200 text-gray-800"
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}