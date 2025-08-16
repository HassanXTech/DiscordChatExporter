import React, { useState } from 'react';
import { Download, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { DiscordGuild, DiscordChannel, DiscordDMChannel } from '../types';
import discordService from '../services/discordService';

interface ExportComponentProps {
  guild?: DiscordGuild;
  channel?: DiscordChannel;
  dm?: DiscordDMChannel;
  onBack: () => void;
  onComplete: () => void;
}

const ExportComponent: React.FC<ExportComponentProps> = ({
  guild,
  channel,
  dm,
  onBack,
  onComplete
}) => {
  const [exportLimit, setExportLimit] = useState(1000);
  const [exportFormat, setExportFormat] = useState<'Json' | 'Html' | 'Csv' | 'Txt'>('Json');
  const [includeMedia, setIncludeMedia] = useState(true);
  const [includeEmbeds, setIncludeEmbeds] = useState(true);
  const [includeReactions, setIncludeReactions] = useState(true);
  const [includeThreads, setIncludeThreads] = useState<'All' | 'None'>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [exportProgress, setExportProgress] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  const handleExport = async () => {
    if (channel || dm) {
      setIsLoading(true);
      setError('');
      setExportProgress('Preparing export...');
      
      try {
        if (channel) {
          setExportProgress(`Exporting #${channel.name}...`);
          setProgressPercent(25);
          
          const result = await discordService.exportChannel({
            token: '',
            channelId: channel.id,
            guildId: guild?.id,
            format: exportFormat,
            media: includeMedia,
            reuseMedia: true,
            markdown: false,
            includeThreads: includeThreads,
            limit: exportLimit,
            outputPath: './exports'
          });
          
          setProgressPercent(75);
          
          if (!result.success) {
            throw new Error(result.error || 'Export failed');
          }
        } else if (dm) {
          setExportProgress(`Exporting DM with ${dm.isGroup ? dm.name : dm.recipients[0]?.name}...`);
          setProgressPercent(25);
          
          const result = await discordService.exportDMChannel({
            token: '',
            channelId: dm.id,
            format: exportFormat,
            media: includeMedia,
            reuseMedia: true,
            markdown: false,
            includeThreads: includeThreads,
            limit: exportLimit,
            outputPath: './exports'
          });
          
          setProgressPercent(75);
          
          if (!result.success) {
            throw new Error(result.error || 'Export failed');
          }
        }
        
        setProgressPercent(100);
        setExportProgress('Export completed successfully! Check your downloads folder.');
        setTimeout(() => {
          onComplete();
        }, 2000);
      } catch (err: any) {
        setError(`Export failed: ${err.message}`);
        setExportProgress('');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-discord-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-bold text-white">
              Export Discord Chats
            </h1>
            <button
              onClick={onBack}
              className="discord-button-secondary flex items-center space-x-2 px-6 py-3 rounded-lg hover:bg-discord-lighter transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
          <p className="text-lg text-discord-textMuted max-w-2xl mx-auto">
            Select servers and channels to export your Discord chat history.
          </p>
        </div>

        {/* Export Options Panel */}
        <div className="bg-discord-darker rounded-xl p-8 mb-12 border border-discord-lighter/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Export Options</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Basic Options */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-discord-text mb-3 text-lg">
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as 'Json' | 'Html' | 'Csv' | 'Txt')}
                  className="w-full bg-discord-light border border-discord-lighter rounded-lg px-4 py-3 text-discord-text focus:outline-none focus:ring-2 focus:ring-discord-primary focus:border-transparent text-lg transition-all duration-200"
                >
                  <option value="Json">JSON</option>
                  <option value="Html">HTML</option>
                  <option value="Csv">CSV</option>
                  <option value="Txt">Plain Text</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-discord-text mb-3 text-lg">
                  Message Limit
                </label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  value={exportLimit}
                  onChange={(e) => setExportLimit(parseInt(e.target.value) || 1000)}
                  className="w-full bg-discord-light border border-discord-lighter rounded-lg px-4 py-3 text-discord-text focus:outline-none focus:ring-2 focus:ring-discord-primary focus:border-transparent text-lg transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Right Column - Content Options */}
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="flex items-center space-x-3 text-discord-text cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeMedia}
                    onChange={(e) => setIncludeMedia(e.target.checked)}
                    className="w-5 h-5 rounded border-discord-lighter text-discord-primary focus:ring-discord-primary focus:ring-2 transition-all duration-200"
                  />
                  <span className="text-lg group-hover:text-white transition-colors duration-200">Include Media</span>
                </label>
                
                <label className="flex items-center space-x-3 text-discord-text cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeEmbeds}
                    onChange={(e) => setIncludeEmbeds(e.target.checked)}
                    className="w-5 h-5 rounded border-discord-lighter text-discord-primary focus:ring-discord-primary focus:ring-2 transition-all duration-200"
                  />
                  <span className="text-lg group-hover:text-white transition-colors duration-200">Include Embeds</span>
                </label>
                
                <label className="flex items-center space-x-3 text-discord-text cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeReactions}
                    onChange={(e) => setIncludeReactions(e.target.checked)}
                    className="w-5 h-5 rounded border-discord-lighter text-discord-primary focus:ring-discord-primary focus:ring-2 transition-all duration-200"
                  />
                  <span className="text-lg group-hover:text-white transition-colors duration-200">Include Reactions</span>
                </label>
                
                <div className="pt-2">
                  <label className="block text-sm font-semibold text-discord-text mb-3 text-lg">
                    Include Threads
                  </label>
                  <select
                    value={includeThreads}
                    onChange={(e) => setIncludeThreads(e.target.value as 'All' | 'None')}
                    className="w-full bg-discord-light border border-discord-lighter rounded-lg px-4 py-3 text-discord-text focus:outline-none focus:ring-2 focus:ring-discord-primary focus:border-transparent text-lg transition-all duration-200"
                  >
                    <option value="All">All Threads</option>
                    <option value="None">No Threads</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Export Info */}
          {(channel || dm) && (
            <div className="mt-8 p-5 bg-discord-light/30 rounded-lg border border-discord-primary/30">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-discord-primary rounded-full animate-pulse"></div>
                <p className="text-discord-text text-lg">
                  {channel 
                    ? `Exporting messages from #${channel.name} in ${guild?.name || 'Unknown Server'}`
                    : `Exporting messages from DM with ${dm?.isGroup ? dm.name : dm?.recipients?.[0]?.name || 'User'}`
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Export Button and Progress */}
        <div className="text-center space-y-8">
          {/* Progress Bar */}
          {isLoading && (
            <div className="w-full max-w-lg mx-auto">
              <div className="flex items-center justify-between text-sm text-discord-textMuted mb-3">
                <span className="text-lg">{exportProgress}</span>
                <span className="text-lg font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-discord-light rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-discord-primary to-discord-secondary h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isLoading}
            className="group relative inline-flex items-center justify-center px-16 py-6 text-2xl font-bold text-white bg-gradient-to-r from-discord-primary to-discord-secondary rounded-2xl shadow-2xl hover:shadow-discord-primary/25 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 ease-out transform"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin mr-4" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-8 h-8 mr-4 group-hover:animate-bounce" />
                Export Chat
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-8 p-5 bg-discord-danger/20 border border-discord-danger rounded-xl">
            <p className="text-lg text-discord-danger flex items-center justify-center">
              <AlertCircle className="w-6 h-6 mr-3" />
              {error}
            </p>
          </div>
        )}

        {/* Progress Display */}
        {exportProgress && !isLoading && (
          <div className="mt-8 p-5 bg-discord-primary/20 border border-discord-primary rounded-xl">
            <p className="text-lg text-discord-primary flex items-center justify-center">
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              {exportProgress}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportComponent;
