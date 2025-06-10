# WordPress Integration for BotSmith

## Option 1: Iframe Embed (Easiest)

Add this to a WordPress page:

```html
<iframe 
  src="https://your-botsmith-url.com/create-agent" 
  width="100%" 
  height="800px" 
  frameborder="0"
  style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
>
  Your browser doesn't support iframes.
</iframe>
```

## Option 2: WordPress Shortcode

Create a custom shortcode in your theme's functions.php:

```php
function adoptabot_creator_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '800px',
        'width' => '100%'
    ), $atts);
    
    return '<iframe src="https://your-botsmith-url.com/create-agent" width="' . $atts['width'] . '" height="' . $atts['height'] . '" frameborder="0" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"></iframe>';
}
add_shortcode('adoptabot_creator', 'adoptabot_creator_shortcode');
```

Then use `[adoptabot_creator]` in any page or post.

## Quick Deploy with Vercel (Free)

1. Push your code to GitHub
2. Connect to Vercel  
3. Get a live URL like: https://adoptabot-creator.vercel.app
4. Embed in WordPress

## WordPress Page Setup

Create a new page called "Create Your AI Agent" with this content:

```html
<div style="text-align: center; margin-bottom: 20px;">
  <h1>🤖 Create Your Perfect AI Agent</h1>
  <p>Chat with BotSmith to build a custom AI assistant for your business</p>
</div>

<div style="max-width: 1200px; margin: 0 auto;">
  [adoptabot_creator height="900px"]
</div>

<div style="text-align: center; margin-top: 20px;">
  <p><strong>Need help?</strong> Contact us for implementation support!</p>
</div>
```

