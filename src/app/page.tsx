import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Glass Morphism Header */}
      <header className="relative backdrop-blur-lg bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🔒</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                SecureVault
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {session ? (
                <>
                  <Link 
                    href="/vault" 
                    className="text-gray-300 hover:text-white font-medium transition-all duration-200 hover:scale-105"
                  >
                    My Vault
                  </Link>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">
                      Welcome, {session.user?.name || session.user?.email?.split('@')[0]}
                    </span>
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {(session.user?.name?.[0] || session.user?.email?.[0] || 'U').toUpperCase()}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/login" 
                    className="text-gray-300 hover:text-white font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden">
              {session ? (
                <Link 
                  href="/vault"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Vault
                </Link>
              ) : (
                <Link 
                  href="/login"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        {/* Hero Content */}
        <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-pulse">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></div>
              <span className="text-sm text-green-300 font-medium">Trusted by thousands worldwide</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block">Your Digital Life,</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Perfectly Secured
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Enterprise-grade security meets stunning simplicity. 
              <span className="block">Zero-knowledge encryption that puts you in complete control.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {session ? (
                <Link
                  href="/vault"
                  className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-2xl"
                >
                  <span className="relative z-10">Access Your Vault</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-2xl"
                  >
                    <span className="relative z-10">Start Free Trial</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    href="/login"
                    className="group relative backdrop-blur-sm bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="relative z-10">Sign In</span>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">256-bit</div>
                <div className="text-gray-400 text-sm">Encryption</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">Zero</div>
                <div className="text-gray-400 text-sm">Knowledge</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-400 text-sm">Protection</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
                Why <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">SecureVault</span>?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Built with cutting-edge technology and designed for absolute privacy
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Military-Grade Encryption</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Your data is encrypted with AES-256 before it leaves your device. 
                    We never see your passwords - only you hold the keys.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Instant access to your passwords across all devices. 
                    No delays, no compromises on speed or security.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Cross-Platform Sync</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Seamlessly sync your passwords across all your devices. 
                    Available on web, mobile, and desktop applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-sm bg-white/5 rounded-3xl p-12 border border-white/10">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
                Ready to Secure Your Digital Life?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join millions who trust SecureVault with their most sensitive information
              </p>
              <Link
                href={session ? "/vault" : "/register"}
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                {session ? "Open My Vault" : "Start Free Today"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative backdrop-blur-sm bg-white/5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🔒</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                SecureVault
              </span>
            </div>
            <div className="text-gray-400 text-sm flex items-center justify-center space-x-2">
              © 2025 SecureVault. Protecting your digital life with zero compromises.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}