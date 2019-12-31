# embed-videos-javascript-library

## Descripion
This library allow you embed videos in your website in a easy way. 
It also allow you modify all the videos changing only your JavaScript code.

## Installation
Just import the javascript file in your html

```javascript
<script src="path-to-file/embed.js"></script>
```

## Usage
You need create a embed object to use the library. 

```javascript
let embed = new Embed();
```

If you want have the iframe html code to embed a video, you can use the video method. 

```javascript
let embed = new Embed();
embed.video(url)
```

You can also add videos directly on html code ussing the tag `video-embed` , and then call to `autoEmbedVideos`. 

```html
<!DOCTYPE html>
<html>
<head>
<script src="embed.js"></script>
</head>
<body>
  <section id="automatic-embed">
      <video-embed src="https://www.youtube.com/watch?v=clXk1govJjA" width="30"></video-embed>
      <video-embed src="https://www.dailymotion.com/video/x7po0zx?playlist=x63ggo"></video-embed>
      <video-embed src="https://vimeo.com/378753132"></video-embed>
  </section>
<script type="text/javascript">
    let embed = new Embed(); 
    embed.video(url)
    embed.autoEmbedVideos(); 
</script>
</body>
</html>
```

### Methods
#### video(url, [options])
This method return a iframe html code to embed the video passed in the url.
You can personalize the video atributes passing a Map with some options.

Simple usage:
```Javascript 
let embed = new Embed(); 
embed.video("https://www.youtube.com/watch?v=clXk1govJjA");
```
Options usage:
```Javascript 
let embed = new Embed(); 
let options = new Map();
options.set("width", "100%");
embed.video("https://www.youtube.com/watch?v=clXk1govJjA", options);
```
#### autoEmbedVideos([tagName, [urlAttribute]])
This method allow you auto-embed all the video with the tagName `<video-embed src="video-url"></video-embed>`  

Simple usage: 
```html
<!DOCTYPE html>
<html>
<head>
<script src="embed.js"></script>
</head>
<body>
  <section id="automatic-embed">
      <video-embed src="https://www.youtube.com/watch?v=clXk1govJjA"></video-embed>
      <video-embed src="https://www.dailymotion.com/video/x7po0zx?playlist=x63ggo"></video-embed>
      <video-embed src="https://vimeo.com/378753132"></video-embed>
  </section>
<script type="text/javascript">
    let embed = new Embed(); 
    embed.video(url)
    embed.autoEmbedVideos(); 
</script>
</body>
</html>
```

You can also change the tagName to insert your videos, and the attribute name to insert the video url. **We don't recomment change the attribute name to insert the url.**
You can add personalized attributes to each video.

Advanced usage: 
```html
<!DOCTYPE html>
<html>
<head>
<script src="embed.js"></script>
</head>
<body>
  <section id="automatic-embed">
      <personalized-tagName urlAttribute="https://www.youtube.com/watch?v=clXk1govJjA" width="30"></personalized-tagName>
      <personalized-tagName urlAttribute="https://www.dailymotion.com/video/x7po0zx?playlist=x63ggo"></personalized-tagName>
      <personalized-tagName urlAttribute="https://vimeo.com/378753132"></personalized-tagName>
  </section>
<script type="text/javascript">
    let embed = new Embed(); 
    embed.autoEmbedVideos("personalized-tagName","urlAttribute"); 
</script>
</body>
</html>
```

### Personalization
You can personalize your default videos atributes. 

#### Default Options
The default options have the less priority, so if there are other options with same attribute but different value, the value the other option will apply. 

You can modify them with property `defaultOptions`

```Javascript 
let embed = new Embed(); 
embed.defaultOptions.set("width", "100%");
```
So all the videos that haven't to a `width` attribute will have the attribute `width` with the value `100%`.
#### Source options
The source options allow you personalize each sources with their options, for example the Youtube options may be different to the Vimeo optios.

You can personalize them: 

```Javascript
let embed = new Embed(); 
embed.videoSources[i].options.set("width", "100%");
```
With `i`the number of source.

#### FinalOptions
It's the same that DefaultOptions but they have more priority than Souce Options and the defaut options.

*Note: the highest priority is the options that usser put in the html element or the options passed to the method Video*
#### Add new source
Do You have a source that is not soupported yet? No worries, you can add it.

```Javascript
let embed = new Embed();
let newDomain1 = new DomainSource("newDomain", /regex to find the video id in this comain/);
let newDomain2 = new DomainSource("newDomai2", /regex to find the video id in this comain/);
let sourceOptions = new Map(); 
	sourceOptions.set("attribute1", "value");
	sourceOptions.set("attribute2", "value");
let newSource = new VideoSource([newDomain1, newDomain2], function (id) {
							return `https://url-to-embed/${id}`; 
						}, sourceOptions); 
embed.addVideoSource(newSource);
```

The process to add a new source has 3 parts.
#### Firs part: Add the domains from this source

Normally a source have just one domain, but it may have some, like youtube, it have the domain "www.youtube.com" and the domian "youtu.be", you can add all domains as you want to the same source.

For each domain, you have to add a regex to find the video id in the url from this domain. **Important: to make this process eassier, the id must be in a group called "id"**

##### Youtube example
```Javascript
let youtubeDomain = new DomainSource("www.youtube.com", /youtube\.com\/watch\?v=(?<id>.+?)(?:&|$)/);
let youtuDomain = new DomainSource("youtu.be", /youtu\.be\/(?<id>.+)(\?|$)/);
```
#### Second part: Add the domains, a function that allow to embed the videos with the id and the options of this source
The domains is a array with the object created in the last step.
The options is a Map where the kay is the attribute name and the value the value of the attribute.
And finally you have to add a funcion where you will pass a Id as arguent to generate the url to embed the video. 
##### Youtube example
```Javascript
let youtubeOptions = new Map(); 
	youtubeOptions.set("width", "560");
	youtubeOptions.set("height", "315");
	youtubeOptions.set("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
let youtubeSource = new VideoSource([youtubeDomain, youtuDomain], function (id) {
							return `https://www.youtube.com/embed/${id}`; 
						}, youtubeOptions); 
```
#### Third part:
The last part is the easiest part, it's to add this source to the embed objet. 

##### Youtube example
```Javascript
embed.addVideoSource(youtubeSource); 
```

### Supported Sources
This sources are native supported

| #        | Source           |
| ------------- |-------------:| 
| 1 | YouTube |
| 2 | Dailymotion |
| 3 | Vimeo |
| 4 | Instagram |
