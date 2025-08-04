# YouTube API Setup Instructions

This application now uses the real YouTube Data API v3 to fetch search results instead of hardcoded data.

## Getting a YouTube API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Create a new project or select an existing one

3. **Enable YouTube Data API v3**
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"

4. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

5. **Configure the API Key**
   - Create a `.env.local` file in the project root
   - Add: `NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here`
   - Replace `your_api_key_here` with your actual API key

## Example .env.local file

```
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyBOTI22WdGBs9LD9HlNnBOFhiGVzfG2tlg
```

## Fallback Behavior

If no API key is configured, the application will automatically fall back to a curated demo database with popular YouTube videos. This allows the app to work without API setup for demonstration purposes.

## API Quotas and Limits

- YouTube Data API v3 has daily quotas
- Each search request costs 100 quota units
- Each video details request costs 1 quota unit per video
- Default quota is 10,000 units per day
- For production use, you may need to request quota increases

## Security Notes

- Never commit your API key to version control
- The `.env.local` file is already in `.gitignore`
- Use environment variables for production deployment
- Consider implementing server-side API calls for better security

## Testing the Integration

1. Set up your API key as described above
2. Restart the development server: `npm run dev`
3. Try searching for videos - you should see real YouTube results
4. Check the browser console for any API errors

## Troubleshooting

- **"YouTube API key not configured"**: Add your API key to `.env.local`
- **"YouTube API error: 403"**: Check that YouTube Data API v3 is enabled
- **"YouTube API error: 400"**: Verify your API key is correct
- **Quota exceeded**: Wait for quota reset or request increase from Google
