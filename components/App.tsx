import React, { useState, useEffect } from 'react';
import { MOCK_NEWS, TICKER_HEADLINES, ADMISSION_DATES } from '../constants';
import { NewsItem, ChatMessage, UniversityCategory } from '../types';
import universityData from '../universities';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<UniversityCategory>('All');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const filteredNews = selectedCategory === 'All' 
    ? MOCK_NEWS 
    : MOCK_NEWS.filter(news => news.category === selectedCategory);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response (replace with actual Gemini API call)
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        role: 'model',
        text: `I understand you're asking about "${inputMessage}". This is a placeholder response. To enable full AI functionality, configure the Gemini API key in your environment variables.`
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header with Ticker */}
      <header className="gradient-bg text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">CampusAI.ng</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="ticker-wrap bg-black/20 rounded px-4 py-2">
            <div className="ticker-content text-sm">
              {TICKER_HEADLINES.join(' • ')} • {TICKER_HEADLINES.join(' • ')}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {(['All', 'Federal', 'State', 'Private', 'JAMB'] as UniversityCategory[]).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
            <div className="space-y-4">
              {filteredNews.map(news => (
                <article
                  key={news.id}
                  className={`p-6 rounded-lg shadow-md transition ${
                    darkMode
                      ? 'bg-gray-800 hover:bg-gray-750'
                      : 'bg-white hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      news.category === 'Federal' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      news.category === 'State' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      news.category === 'Private' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                    }`}>
                      {news.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{news.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{news.excerpt}</p>
                  {news.sourceUrl && (
                    <a
                      href={news.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Read more →
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>

          {/* AI Chat Section */}
          <div className="lg:col-span-1">
            <div className={`sticky top-4 rounded-lg shadow-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold">AI Assistant</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ask about admissions, universities, or JAMB
                </p>
              </div>
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <p>Start a conversation with the AI assistant</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-100 dark:bg-blue-900 ml-auto max-w-[80%]'
                          : 'bg-gray-100 dark:bg-gray-700 mr-auto max-w-[80%]'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mr-auto max-w-[80%]">
                    <p className="text-sm">Thinking...</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask a question..."
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Universities Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Nigerian Universities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {universityData.slice(0, 12).map((uni, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg shadow ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-750'
                    : 'bg-white hover:shadow-md'
                } transition`}
              >
                <h3 className="font-semibold mb-1">{uni.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{uni.category}</p>
                <a
                  href={uni.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  Visit website →
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={`mt-12 py-8 border-t ${
        darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
      }`}>
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
          <p>© 2026 CampusAI.ng - Stay Ahead with Nigerian University Updates</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
