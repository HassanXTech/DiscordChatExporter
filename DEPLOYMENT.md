# Deployment Guide

## 🚀 Deploying Discord Chat Exporter

This guide covers various deployment options for the Discord Chat Exporter application.

## 📦 Build the Application

First, build the production version:

```bash
npm run build
```

This creates a `build/` folder with optimized production files.

## 🌐 Deployment Options

### 1. **Netlify (Recommended)**

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Connect your GitHub repository
   - Select the `discord-chat-exporter-app` folder

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Node version: `18` or higher

3. **Environment Variables**
   - No environment variables needed for basic deployment

4. **Deploy**
   - Netlify will automatically deploy on every push to master

### 2. **Vercel**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Select the `discord-chat-exporter-app` folder
   - Build command: `npm run build`
   - Output directory: `build`

### 3. **GitHub Pages**

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### 4. **Traditional Web Server**

1. **Upload Files**
   - Upload the entire `build/` folder to your web server
   - Ensure the server supports single-page applications

2. **Configure Server**
   - Set up URL rewriting for React Router
   - Example Apache `.htaccess`:
     ```apache
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
     ```

## 🔧 Environment Configuration

### Production Build

The application is configured for production by default. No additional environment variables are required.

### Custom Domain

1. **Netlify/Vercel**: Use their domain management interface
2. **GitHub Pages**: Configure in repository settings
3. **Custom Server**: Update DNS records and server configuration

## 📱 Mobile Optimization

The application is already optimized for mobile devices with:
- Responsive design
- Touch-friendly interface
- Mobile-first CSS approach

## 🔒 Security Considerations

- **HTTPS**: Always use HTTPS in production
- **CORS**: Configure if needed for your domain
- **Content Security Policy**: Consider adding CSP headers

## 📊 Performance Monitoring

### Lighthouse Score
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

### Bundle Analysis
```bash
npm install --save-dev source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

## 🚨 Troubleshooting

### Build Issues
- Ensure Node.js version is 16+
- Clear `node_modules` and reinstall
- Check for TypeScript errors

### Deployment Issues
- Verify build folder exists
- Check build command output
- Ensure proper file permissions

### Runtime Issues
- Check browser console for errors
- Verify API endpoints are accessible
- Test with different browsers

## 📞 Support

For deployment issues:
1. Check the [GitHub Issues](https://github.com/HassanXTech/DiscordChatExporter/issues)
2. Review build logs
3. Test locally first

---

**Happy Deploying! 🎉**
