# CourseDump2022
This Google Chrome extension downloads Memrise courses (media included) and outputs them to .csv files for further use. Anki-compatible.

## Downloading from GitHub
![download instruction diagram](https://user-images.githubusercontent.com/4579891/196221075-c123da2a-fc68-40a8-8836-41abb4109da8.png)

## Installation
1. Extract ***CourseDump2022-main.zip***
2. *In Google Chrome*: `Menu` -> `More tools` -> `Extensions` -> `Developer mode` (top right) -> `Load unpacked`
3. Navigate to ***CourseDump2022-main*** folder -> `Select Folder`

## Usage
1. Make sure you are logged in on [memrise.com](https://memrise.com/)
2. Navigate to any page belonging to a course you want to download ([example-1](https://app.memrise.com/course/1105/speak-esperanto-like-a-nativetm-1/), [example-2](https://app.memrise.com/course/2021573/french-1/3/))
3. ![Chrome extensions icon](https://user-images.githubusercontent.com/4579891/196231354-fc8bb79d-96cf-4930-a9f6-2292fbdbc836.jpg) -> ![CourseDump2022 extension menu entry](https://user-images.githubusercontent.com/4579891/196231410-6530011e-4a53-487e-8cfc-9099181adfc1.jpg)

## Importing in Anki
* Prerequisite: double-click or import in Anki the .apkg file included in ***CourseDump2022-main*** folder. It will add required Note Types to your Anki profile. The extension lists media files as separate fields. This is done in order to be able to move media files between cards as one prefers simply by editing these two templates instead of going on editing every card of a deck.
1. `Anki` -> `Import file` (bottom) -> `Select` imported .csv -> `Open`
2. `Type` -> `Basic (with media)` or `Basic (and reversed card with media)`
3. `Deck` -> `Add` -> Enter a name -> `Ok`
4. `Import` 

If you have further questions regarding the extention or need any help with using the data it produces in Anki, please leave a comment in this thread: [Memrise2Anki Replacement](https://community.memrise.com/t/memrise2anki-replacement/77107)
