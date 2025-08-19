'use client';

import { useState, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';

// Script writing component
export default function Videos() {
  // State for manual script input
  const [scriptContent, setScriptContent] = useState('');
  const [isAiMode, setIsAiMode] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScripts, setGeneratedScripts] = useState<Array<{ id: string; content: string; title: string }>>([]);
  
  // State for AI generation form
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('English');
  const [sourceUrl, setSourceUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState('Gemini'); // Set Gemini as default
  
  // State for Image generation form
  const [imagePrompt, setImagePrompt] = useState('');
  const [selectedImageModel, setSelectedImageModel] = useState('Stable Diffusion');
  const [selectedImagePreset, setSelectedImagePreset] = useState('Photorealistic');
  const [generatedImages, setGeneratedImages] = useState<Array<{id: string, url: string, prompt: string, model: string}>>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // Character count calculation
  const charCount = scriptContent.length;
  
  // Handle clear script
  const handleClearScript = useCallback(() => {
    setScriptContent('');
  }, []);
  
  // Set specific modes directly
  const setManualMode = useCallback(() => {
    if (isAiMode) setIsAiMode(false);
  }, [isAiMode]);

  const setAIMode = useCallback(() => {
    if (!isAiMode) setIsAiMode(true);
  }, [isAiMode]);
  
  // Handle AI script generation
  const handleGenerateScript = useCallback(async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    
    try {
      // Import dynamically to avoid server-side issues
      const { 
        generateScriptWithGemini, 
        generateScriptWithGPT4,
        generateScriptWithClaude,
        generateScriptWithLlama,
        generateScriptWithGroq,
        generateScriptWithCohere,
        generateScriptWithHuggingFace
      } = await import('@/utils/ai-models');
      
      // Select the appropriate model function
      let generateFunction;
      switch (selectedModel) {
        case 'Gemini':
          generateFunction = generateScriptWithGemini;
          break;
        case 'GPT-4':
          generateFunction = generateScriptWithGPT4;
          break;
        case 'Claude':
          generateFunction = generateScriptWithClaude;
          break;
        case 'Llama-2':
          generateFunction = generateScriptWithLlama;
          break;
        case 'Groq':
          generateFunction = generateScriptWithGroq;
          break;
        case 'Cohere':
          generateFunction = generateScriptWithCohere;
          break;
        case 'HuggingFace':
          generateFunction = generateScriptWithHuggingFace;
          break;
        default:
          generateFunction = generateScriptWithGemini;
      }
      
      // Generate the script content
      const scriptContent = await generateFunction(prompt, language, sourceUrl);
      
      // Create new script object
      const newScript = {
        id: Date.now().toString(),
        title: prompt.slice(0, 30) + (prompt.length > 30 ? '...' : ''),
        content: scriptContent,
        model: selectedModel,
        timestamp: new Date().toISOString(),
        language: language
      };

      // Update state
      setGeneratedScripts(prevScripts => [newScript, ...prevScripts]);
    } catch (error: any) {
      console.error('Error generating script:', error);
      
      // Create a more user-friendly error message
      let errorMessage = error.message || 'Unknown error';
      
      // Special handling for common Gemini API errors
      if (errorMessage.includes('models/gemini')) {
        errorMessage = 'The Gemini model could not be accessed. Please check your API key is correct and that you have proper access to the Gemini API.';
      } else if (errorMessage.includes('API key')) {
        errorMessage = 'Invalid or missing API key. Please add your Gemini API key to the .env.local file.';
      } else if (errorMessage.includes('quota')) {
        errorMessage = 'API quota exceeded. Please check your Google AI account limits.';
      }
      
      // Display a user-friendly error message
      alert(`Error generating script: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedModel, language, sourceUrl]);
  
  // Handle copy script to clipboard
  const handleCopyScript = useCallback((content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => alert('Script copied to clipboard!'))
      .catch(err => console.error('Could not copy text: ', err));
  }, []);
  
  // Handle image generation
  const handleGenerateImage = useCallback(() => {
    if (!imagePrompt) return;
    
    setIsGeneratingImage(true);
    
    // Simulate image generation with a timeout
    setTimeout(() => {
      const newImage = {
        id: Date.now().toString(),
        url: `https://source.unsplash.com/random/600x400?${encodeURIComponent(imagePrompt)}`,
        prompt: imagePrompt,
        model: selectedImageModel
      };
      
      setGeneratedImages(prevImages => [newImage, ...prevImages]);
      setIsGeneratingImage(false);
    }, 2000);
  }, [imagePrompt, selectedImageModel]);

  // Handle edit generated script
  const handleEditScript = useCallback((script: { id: string; content: string; title: string }) => {
    setIsAiMode(false);
    setScriptContent(script.content);
  }, []);
  
  // Render the appropriate interface based on mode
  const renderInterface = () => {
    if (isAiMode) {
      return (
        <div className="space-y-8">
          {/* Two-column layout for Script Writer and Image Generator */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Video Script Writer Section */}
            <div className="flex-1">
              <h2 className="text-xl mb-6 font-semibold">Video Script Writer</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left - Form Fields (3 columns) */}
                <div className="md:col-span-3 grid grid-cols-1 gap-6">
                  {/* Prompt / Topic - IMPORTANT: This must be first */}
                  <div>
                    <label className="block mb-2">Prompt / Topic</label>
                    <input 
                      type="text" 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="What should the script be about?"
                      className="w-full p-2.5 rounded-md"
                      style={{
                        backgroundColor: 'var(--color-input-background)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)'
                      }}
                    />
                  </div>

                  {/* Select AI Model */}
                  <div>
                    <label className="block mb-2">Select AI Model</label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full p-2.5 rounded-md"
                      style={{
                        backgroundColor: 'var(--color-input-background)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <option value="Gemini">Gemini 2.0 Flash (Fast)</option>
                      <option value="GPT-4">GPT-4 (Most Advanced)</option>
                      <option value="Groq">Groq (Ultra Fast)</option>
                      <option value="Cohere">Cohere (Semantic)</option>
                      <option value="Claude">Claude 2</option>
                      <option value="HuggingFace">HuggingFace (Open Source)</option>
                      <option value="Llama-2">Llama 2</option>
                    </select>
                  </div>
              
                  {/* Language */}
                  <div>
                    <label className="block mb-2">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full p-2.5 rounded-md"
                      style={{
                        backgroundColor: 'var(--color-input-background)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <option value="English">English</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                  </div>
              
                  {/* Source URL (optional) */}
                  <div>
                    <label className="block mb-2">Source URL (optional)</label>
                    <input 
                      type="text" 
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://example.com/article"
                      className="w-full p-2.5 rounded-md"
                      style={{
                        backgroundColor: 'var(--color-input-background)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)'
                      }}
                    />
                  </div>
                </div>
                
                {/* Right - Generate Button */}
                <div className="flex items-end justify-end md:col-span-1">
                  <button
                    onClick={handleGenerateScript}
                    className="w-full py-3.5 px-5 text-white font-medium rounded-md"
                    style={{
                      background: 'linear-gradient(to right, var(--color-accent), var(--color-accent-hover))',
                      boxShadow: 'var(--shadow-md)',
                      height: '48px',
                      border: 'none',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    disabled={!prompt || isGenerating}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Generating...
                      </div>
                    ) : (
                      'Generate Script'
                    )}
                  </button>
                </div>
              </div>

              {/* Current Script */}
              <div className="mt-6">
                <h3 className="text-lg mb-3">Current Script</h3>
                <div 
                  className="rounded-md p-4 overflow-auto border" 
                  style={{
                    backgroundColor: 'var(--color-background-secondary)',
                    color: 'var(--color-text-primary)',
                    borderColor: 'var(--color-border)',
                    minHeight: '200px',
                    boxShadow: 'var(--shadow-inner)'
                  }}
                >
                  {generatedScripts.length > 0 ? (
                    <div className="whitespace-pre-wrap font-mono text-sm">
                      {generatedScripts[0].content}
                    </div>
                  ) : (
                    <div className="text-center py-20" style={{ color: 'var(--color-text-secondary)' }}>
                      <p>Generate a script to see it here</p>
                      <p className="mt-2 text-sm">Choose Gemini as your AI model for best results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Manual Mode
      return (
        <div className="space-y-5">
          <div className="relative">
            <textarea
              value={scriptContent}
              onChange={(e) => setScriptContent(e.target.value)}
              placeholder="Write your video script here..."
              className="w-full min-h-[300px] p-4 rounded-md text-body"
              style={{
                backgroundColor: 'var(--color-input-background)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-mono)',
                lineHeight: '1.6'
              }}
            />
            
            {/* Character count */}
            <div 
              className="absolute bottom-3 right-3 text-xs py-1 px-2 rounded-md"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'var(--color-text-secondary)',
                backdropFilter: 'blur(4px)'
              }}
            >
              {charCount} characters
            </div>
          </div>
          
          {/* Clear and Copy buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleClearScript}
              className="minimal-button"
              disabled={!scriptContent}
            >
              Clear
            </button>
            <button
              onClick={() => handleCopyScript(scriptContent)}
              className="minimal-button-primary"
              disabled={!scriptContent}
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      );
    }
  };
  
  return (
    <AppLayout title="Video Scripts">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Two-column layout for Script Writer and Image Generator */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Script Writing Section */}
          <div className="minimal-card lg:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-subtitle font-medium">
                Video Script Writer
              </h2>
              
              {/* Mode Toggle Buttons */}
              <div className="flex items-center">
                <button
                  onClick={setAIMode}
                  className={isAiMode ? 'px-4 py-1 text-sm rounded-l-md minimal-button minimal-button-active' : 'px-4 py-1 text-sm rounded-l-md minimal-button'}
                >
                  AI Writer
                </button>
                <button
                  onClick={setManualMode}
                  className={!isAiMode ? 'px-4 py-1 text-sm rounded-r-md minimal-button minimal-button-active' : 'px-4 py-1 text-sm rounded-r-md minimal-button'}
                >
                  Manual
                </button>
              </div>
            </div>
            {/* Dynamic Interface based on mode */}
            {renderInterface()}
          </div>
        </div>
        
        {/* Script History - Last 5 Generated Scripts */}
        {generatedScripts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Script History</h2>
            
            <div className="flex overflow-x-auto gap-4 pb-4" style={{ scrollbarWidth: 'thin' }}>
              {generatedScripts.slice(0, 5).map((script) => (
                <div 
                  key={script.id} 
                  className="rounded-lg p-4 flex-shrink-0" 
                  style={{
                    backgroundColor: 'var(--color-surface)', 
                    borderColor: 'var(--color-border)', 
                    borderWidth: '1px',
                    borderLeftColor: 'var(--color-accent)',
                    borderLeftWidth: '3px',
                    boxShadow: 'var(--shadow-md)',
                    minWidth: '250px',
                    maxWidth: '320px',
                    backgroundImage: 'linear-gradient(135deg, var(--color-surface), var(--color-primary))',
                  }}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-sm truncate mr-2" style={{ color: 'var(--color-text-primary)' }}>
                        {script.title || 'Untitled Script'}
                      </h3>
                      <div className="space-x-1 flex-shrink-0">
                        <button
                          onClick={() => handleCopyScript(script.content)}
                          className="minimal-button-sm"
                          title="Copy script"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M8 12h12v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div 
                      className="p-2 rounded-md overflow-hidden mb-2 h-20" 
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)',
                        opacity: '0.9',
                      }}
                    >
                      <div className="whitespace-pre-wrap font-mono text-xs overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: '4', WebkitBoxOrient: 'vertical' }}>
                        {script.content}
                      </div>
                    </div>
                    
                    <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      <div className="flex justify-between">
                        <span>{script.title?.split(' ')[0] || 'Script'}</span>
                        <span>{script.content.length} chars</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
