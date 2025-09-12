# 🌐 AI Live Translator

A powerful Chrome extension that provides intelligent translation and AI-powered summarization for any webpage. Built with TypeScript, React, and Vite for a modern, responsive experience.

![AI Live Translator Demo](demo.html)

## ✨ Features

### 🎯 Core Translation Features
- **Smart Text Selection**: Select any text on any webpage for instant translation
- **Full Page Translation**: Translate entire webpages while preserving layout
- **Auto-Language Detection**: Automatically detect source language
- **20+ Supported Languages**: Including English, Spanish, French, German, Chinese, Japanese, and more
- **Real-time Translation**: Fast, responsive translations with confidence scores

### 🤖 AI-Powered Features
- **Intelligent Summarization**: Get concise summaries of webpage content
- **Multiple LLM Support**: Works with OpenAI GPT, Google Gemini, and Anthropic Claude
- **Customizable Models**: Choose from various models (GPT-3.5, GPT-4, Gemini Pro, Claude 3, etc.)
- **Target Language Summaries**: Summarize content directly in your preferred language

### 🎨 User Interface
- **Side Panel Interface**: Comprehensive translation controls in an easy-to-use side panel
- **Quick Access Popup**: Fast translation actions via extension popup
- **Options Page**: Detailed configuration for LLM providers and translation settings
- **Modern Design**: Clean, responsive UI with gradient themes and smooth animations

### 🔧 Technical Features
- **Chrome Extension Manifest V3**: Built with the latest Chrome extension standards
- **TypeScript**: Type-safe development for reliability and maintainability
- **React Components**: Modern, component-based UI architecture
- **Vite Build System**: Fast development and optimized production builds
- **Local Storage**: Secure, local storage of API keys and preferences

## 🚀 Installation

### For Developers

1. **Clone the repository**:
```bash
git clone https://github.com/realharry/ai-live-translator.git
cd ai-live-translator
```

2. **Install dependencies**:
```bash
npm install
```

3. **Build the extension**:
```bash
npm run build
```

4. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder
   - The extension will appear in your extensions list

### For Users

1. Download the latest release from the GitHub releases page
2. Unzip the downloaded file
3. Follow steps 4 from the developer installation above

## 🎯 Quick Start

### Basic Translation

1. **Install and activate** the extension
2. **Navigate** to any webpage with text
3. **Select text** you want to translate
4. **Click the extension icon** or use the side panel for translation options
5. **Choose your target language** and click "Translate Selection"

### AI Summarization Setup

1. **Open the Options page** by right-clicking the extension icon and selecting "Options"
2. **Choose your LLM provider** (OpenAI, Google Gemini, or Anthropic Claude)
3. **Enter your API key** from your chosen provider:
   - **OpenAI**: Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Google Gemini**: Get API key from [Google AI Studio](https://ai.google.dev/tutorials/setup)
   - **Anthropic Claude**: Get API key from [Anthropic Console](https://console.anthropic.com/account/keys)
4. **Test the connection** using the "Test" button
5. **Save your settings**

### Using the Side Panel

1. **Click the extension icon** and select "Open Side Panel"
2. **Configure your target language** and enable auto-translation if desired
3. **Select text** on any webpage to see translations appear automatically
4. **Use "Summarize Page"** to get AI-generated summaries of the current webpage

## 🛠️ Development

### Project Structure

```
src/
├── background/          # Extension background script
├── content/            # Content script for webpage interaction
├── popup/              # Extension popup UI
├── sidepanel/          # Side panel interface
├── options/            # Options page for configuration
├── components/         # Shared React components
├── services/           # Translation and LLM services
├── types/              # TypeScript type definitions
├── icons/              # Extension icons
└── manifest.json       # Chrome extension manifest
```

### Available Scripts

- **`npm run dev`**: Start development server with hot reload
- **`npm run build`**: Build extension for production
- **`npm run preview`**: Preview production build
- **`npm run lint`**: Run ESLint for code quality

### Building from Source

```bash
# Install dependencies
npm install

# Development build with watch mode
npm run dev

# Production build
npm run build

# The built extension will be in the `dist/` folder
```

## 🔧 Configuration

### Translation Settings

- **Default Target Language**: Set your preferred translation language
- **Auto-translate**: Automatically translate selected text
- **Language Detection**: Automatic source language detection

### LLM Configuration

Support for multiple AI providers:

| Provider | Models Available | API Key Format |
|----------|------------------|----------------|
| **OpenAI** | GPT-3.5 Turbo, GPT-4, GPT-4 Turbo | `sk-...` |
| **Google Gemini** | Gemini Pro, Gemini Pro Vision | `AIza...` |
| **Anthropic Claude** | Claude 3 Haiku, Sonnet, Opus | `sk-ant-api03-...` |

### Supported Languages

English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese (Simplified), Chinese (Traditional), Arabic, Hindi, Dutch, Swedish, Danish, Norwegian, Finnish, Polish, Turkish

## 🔒 Privacy & Security

- **Local Storage**: All settings and API keys are stored locally on your device
- **No Data Sharing**: Your content and API keys are never sent to our servers
- **Secure Communication**: Direct communication with translation and LLM APIs
- **Open Source**: Full source code available for audit and contribution

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with proper TypeScript types
4. Add tests if applicable
5. Run `npm run build` to ensure the extension builds correctly
6. Submit a pull request with a clear description

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Add proper error handling
- Update documentation for new features
- Test your changes thoroughly

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter issues or have questions:

1. Check the [Issues](https://github.com/realharry/ai-live-translator/issues) page for existing solutions
2. Create a new issue with detailed information about your problem
3. Include Chrome version, extension version, and steps to reproduce

## 🔮 Roadmap

- [ ] Offline translation support
- [ ] Custom translation providers
- [ ] Translation history and favorites
- [ ] Batch translation for multiple selections
- [ ] Voice input and output
- [ ] Mobile browser support
- [ ] Advanced AI features (context-aware translation, style preservation)

---

**Made with ❤️ for the global web community**

Translate the web, understand the world! 🌍✨
