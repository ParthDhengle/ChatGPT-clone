
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, Sparkles, Shield, Zap } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleTryChatGPT = () => {
    if (currentUser) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-chat-bg via-chat-surface to-chat-bg">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-8 h-8 text-chat-green" />
          <span className="text-xl font-bold text-chat-text">ChatGPT Clone</span>
        </div>
        <button
          onClick={handleLogin}
          className="px-4 py-2 text-chat-text hover:text-chat-green transition-colors"
        >
          Log in
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-chat-text mb-6 bg-gradient-to-r from-chat-green to-emerald-400 bg-clip-text text-transparent">
            ChatGPT Clone
          </h1>
          <p className="text-xl md:text-2xl text-chat-text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the power of AI conversation. Get instant answers, creative inspiration, and intelligent assistance.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={handleTryChatGPT}
              className="px-8 py-4 bg-chat-green hover:bg-chat-green-hover text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              Try ChatGPT
            </button>
            <button
              onClick={handleLogin}
              className="px-8 py-4 border border-chat-green text-chat-green hover:bg-chat-green hover:text-white font-semibold rounded-lg transition-all duration-200"
            >
              Login
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-chat-surface p-6 rounded-xl border border-chat-green/20 hover:border-chat-green/40 transition-colors">
              <Sparkles className="w-8 h-8 text-chat-green mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-chat-text mb-2">Creative Ideas</h3>
              <p className="text-chat-text-muted">Generate creative content, brainstorm ideas, and get inspired with AI assistance.</p>
            </div>
            <div className="bg-chat-surface p-6 rounded-xl border border-chat-green/20 hover:border-chat-green/40 transition-colors">
              <Zap className="w-8 h-8 text-chat-green mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-chat-text mb-2">Instant Answers</h3>
              <p className="text-chat-text-muted">Get quick, accurate responses to your questions on any topic.</p>
            </div>
            <div className="bg-chat-surface p-6 rounded-xl border border-chat-green/20 hover:border-chat-green/40 transition-colors">
              <Shield className="w-8 h-8 text-chat-green mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-chat-text mb-2">Secure & Private</h3>
              <p className="text-chat-text-muted">Your conversations are protected with enterprise-grade security.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
