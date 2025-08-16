# Discord Chat Exporter

A modern React web application for exporting and viewing Discord chat history with a beautiful Discord-like interface.

![Discord Chat Exporter](https://img.shields.io/badge/Discord-Chat%20Exporter-7289DA?style=for-the-badge&logo=discord)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Features

- **🔐 Secure Authentication** - Discord token-based authentication
- **📤 Chat Export** - Export Discord chats in multiple formats (JSON, HTML, CSV, TXT)
- **👁️ Live Preview** - Preview messages before exporting
- **🎨 Discord-like UI** - Familiar interface that matches Discord's design
- **📱 Responsive Design** - Works perfectly on desktop and mobile
- **⚡ Real-time Progress** - Live export progress tracking
- **🔍 Advanced Search** - Search through messages and channels
- **📁 File Management** - View and manage exported chat files

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom Discord theme
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Build Tool**: Create React App
- **API Integration**: Discord REST API v10

## 📋 Prerequisites

- Node.js 16+ and npm
- Discord account and token
- Modern web browser

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HassanXTech/DiscordChatExporter.git
   cd DiscordChatExporter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Building for Production

```bash
npm run build
```

The built files will be in the `build/` directory, ready for deployment.

## 📖 Usage

### 1. **Authentication**
- Enter your Discord token to authenticate
- Follow the in-app instructions to obtain your token securely
- **⚠️ Never share your Discord token with anyone**

### 2. **Browse & Select**
- Browse your Discord servers and channels
- Select specific channels or DMs to work with
- View channel information and member counts

### 3. **Preview Messages**
- Preview messages in real-time before exporting
- Search and filter messages
- View attachments, embeds, and reactions

### 4. **Export Chats**
- Choose export format (JSON, HTML, CSV, TXT)
- Set message limits and content options
- Monitor export progress in real-time
- Download exported files

### 5. **View Exports**
- Upload and view previously exported chat files
- Navigate between different channels
- Search through exported messages
- View rich content and attachments

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── AuthComponent.tsx      # Authentication interface
│   ├── BrowseComponent.tsx    # Server/channel browser
│   ├── PreviewComponent.tsx   # Message preview
│   ├── ExportComponent.tsx    # Export interface
│   ├── ViewerComponent.tsx    # Chat viewer
│   └── SettingsComponent.tsx  # User settings
├── services/            # Business logic
│   ├── discordService.ts      # Discord API integration
│   ├── chatViewerService.ts   # Chat viewing
│   └── settingsService.ts     # User preferences
├── types/              # TypeScript definitions
│   └── index.ts               # Discord data interfaces
├── App.tsx             # Main application
└── index.css           # Global styles
```

## 🔒 Security

- **Token Storage**: Tokens are stored only in memory during your session
- **No Persistence**: No sensitive data is saved to disk
- **Secure Logout**: Complete token cleanup on logout
- **API Security**: Secure Discord API integration with proper headers

## 🎨 UI/UX Features

- **Dark Theme**: Discord-inspired dark color scheme
- **Responsive Layout**: Adapts to all screen sizes
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Progress Tracking**: Visual feedback for all operations
- **Keyboard Navigation**: Full keyboard support

## 🚧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Tailwind CSS for styling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Discord](https://discord.com/) for the amazing platform
- [React](https://reactjs.org/) team for the excellent framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/HassanXTech/DiscordChatExporter/issues)
- **Discussions**: [Join community discussions](https://github.com/HassanXTech/DiscordChatExporter/discussions)

## ⚠️ Disclaimer

This application is for educational and personal use. Always respect Discord's Terms of Service and use responsibly. The developers are not responsible for any misuse of this tool.

---

**Made with ❤️ by [HassanXTech](https://github.com/HassanXTech)**

**⭐ Star this repository if you find it helpful!**
