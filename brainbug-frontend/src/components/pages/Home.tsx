import { Link } from 'react-router-dom';
import { Brain, History, BarChart3, TrendingUp, Sparkles, Download, Github, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import brainImage from '/Users/anirudh/CAMPUSCONNECT/BrainBug/brainbug-frontend/src/assets/Gemini_Generated_Image_o0v9s7o0v9s7o0v9.png';

export function Home() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px] pt-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-cyan-400">Your AI Coding Companion</span>
          </div>
          
          <h1 className="text-6xl leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">BugBrain</span>
            <br />
            <span className="text-white">Learns Your Code.</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Grows With You.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-xl">
            An AI coding coach that doesn't just fix bugs — it learns from your unique mistakes, patterns, and style. Together, you evolve into a better developer.
          </p>

          <div className="flex gap-4">
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-lg px-8 py-6">
              <Download className="h-5 w-5 mr-2" />
              Install for Free
            </Button>
            <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8">
            <div>
              <div className="text-3xl bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">50K+</div>
              <div className="text-sm text-gray-400">Developers</div>
            </div>
            <div>
              <div className="text-3xl bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent">1M+</div>
              <div className="text-sm text-gray-400">Bugs Learned</div>
            </div>
            <div>
              <div className="text-3xl bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">4.9★</div>
              <div className="text-sm text-gray-400">VS Code Rating</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
          <img 
            src={brainImage} 
            alt="AI Brain" 
            className="relative z-10 rounded-2xl w-full h-80 object-cover object-center"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Your Personal</span>
            <br />
            <span className="text-white">Code Evolution Partner</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            BugBrain doesn't just point out errors. It learns, adapts, and helps you become the developer you're meant to be.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#161b22] border-cyan-500/30 hover:border-cyan-500 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-cyan-400" />
              </div>
              <CardTitle className="text-white">Learns Your Patterns</CardTitle>
              <CardDescription className="text-gray-400">
                BugBrain analyzes your coding style, common mistakes, and problem-solving approach to provide personalized insights.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#161b22] border-pink-500/30 hover:border-pink-500 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-pink-400" />
              </div>
              <CardTitle className="text-white">Context-Aware Fixes</CardTitle>
              <CardDescription className="text-gray-400">
                Not just generic solutions — BugBrain understands your project's context and suggests fixes that fit your architecture.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#161b22] border-purple-500/30 hover:border-purple-500 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <CardTitle className="text-white">Growth Tracking</CardTitle>
              <CardDescription className="text-gray-400">
                Watch yourself improve over time with visualizations of your coding patterns, strengths, and areas of growth.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#161b22] border-blue-500/30 hover:border-blue-500 transition-all group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-white">Real-Time Coaching</CardTitle>
              <CardDescription className="text-gray-400">
                Get instant, compassionate feedback as you code. Like pair programming with an AI that knows you.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl text-white mb-4">Explore Your Journey</h2>
          <p className="text-xl text-gray-400">Track your progress and dive deep into your coding evolution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/bug-history">
            <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30 hover:border-cyan-500 transition-all h-full cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                    <History className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">127</div>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-cyan-400 transition-colors">Bug History</CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  Dive deep into every bug you've encountered. Review code snippets, patterns, and learn from your journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-cyan-400 group-hover:translate-x-2 transition-transform">
                  View History →
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/analytics">
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500 transition-all h-full cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">78%</div>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-purple-400 transition-colors">Analytics</CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  Visualize your coding patterns, bug distributions, and growth metrics with beautiful charts and insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-purple-400 group-hover:translate-x-2 transition-transform">
                  View Analytics →
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-[#161b22] to-[#0d1117] p-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl"></div>
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 mb-4">
            <span className="text-sm text-pink-400">Free to use • Forever</span>
          </div>
          
          <h2 className="text-5xl">
            <span className="text-white">Ready to code with</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">your new AI companion?</span>
          </h2>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of developers who are leveling up their skills with BugBrain. No credit card. No trials. Just pure growth.
          </p>

          <div className="flex gap-4 justify-center">
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-lg px-8 py-6">
              <Download className="h-5 w-5 mr-2" />
              Install Extension
            </Button>
            <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-lg px-8 py-6">
              <Github className="h-5 w-5 mr-2" />
              View on GitHub
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              Works with VS Code
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-400"></div>
              Privacy-first design
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              Open source core
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
