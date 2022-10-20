# CourseDump2022
This Google Chrome extension downloads Memrise courses (media included) and outputs them to .csv files for further use. Anki-compatible.

## Downloading from GitHub
![download instruction diagram](https://user-images.githubusercontent.com/4579891/196221075-c123da2a-fc68-40a8-8836-41abb4109da8.png)

## Installation
1. [Download](https://github.com/Eltaurus-Lt/CourseDump2022#downloading-from-github) and unpack ***CourseDump2022-main.zip***
2. In *Google Chrome* click the `Extentions` button PIC and then `Manage extensions` PIC
  (alternatively go to `Menu` PIC -> `More tools` -> `Extensions`) 
3. Enable `Developer mode` (top right corner of the page)
  PIC
4. Choose `Load unpacked` (top left corner of the page) and select the ***CourseDump2022-main*** folder extracted in step 1 (ignore the error with the manifest version)
5. (optional) Go back to the Extensions menu from step 3 and pin the extension by clicking the pin button
  PIC

## Usage
1. Make sure you are logged in on [Memrise](https://memrise.com/)
2. Navigate to any page belonging to a course you want to download ([example-1](https://app.memrise.com/course/1105/speak-esperanto-like-a-nativetm-1/), [example-2](https://app.memrise.com/course/2021573/french-1/3/))
3. *Just click the extension icon* PIC
    (alternatively, if you skipped the last step during the installation,  click the `Extentions` button ![Chrome extensions icon](https://user-images.githubusercontent.com/4579891/196231354-fc8bb79d-96cf-4930-a9f6-2292fbdbc836.jpg) and then `CourseDump2022` ![CourseDump2022 extension menu entry](https://user-images.githubusercontent.com/4579891/196231410-6530011e-4a53-487e-8cfc-9099181adfc1.jpg)
 
When the scanning of the course is finished (this might take up to several minutes for large courses!), a `.csv` with all the table data should appear in your downloads folder. After that, if you chose to download media, the extension will proceed to downloading all the audio and video files from the course to a subfolder containing the course's name.

## Importing into Anki

### Simple import without media:
1. In *Anki* click `File` and then `Import`
2. Navigate to the `.csv` file created after [step 3](https://github.com/Eltaurus-Lt/CourseDump2022#usage)
3. 
    3.1 Indicate the Note Type you want to use in the `Type` field (if you don't have any particular Note Type in mind, the Basic one will do)
    3.2 Select the Deck you want cards to go into in the `Deck` field (you can create a new one from this menu by clicking `Deck` -> `Add`)
    3.3 Check the `Field mapping` (if you downloaded the `.csv` table with media, but don't want to use that media in Anki, just select `Change` -> `Ignore field` for any fields after the first two)
  ![image](https://user-images.githubusercontent.com/93875472/196941455-b0a3a3e7-6e33-4510-aff7-fbf079dc7915.png) 

After you click the `Import` button you should see a message indicating how many notes have been improted:
  ![image](https://user-images.githubusercontent.com/93875472/196944166-5fbbfec8-2415-46cd-919a-73330ca67dbb.png)
You can compare this number against the total number of words in the Memrise course you've been downloading. After clicking `Close` you can also check out the imported notes by going to `Browse` and selecting your deck in the decks list on the left side ![image](https://user-images.githubusercontent.com/93875472/196944394-95712a57-c13c-4bf2-bce3-574e55c02a1b.png)

### Import with media
The overal process is the same as [importing without media](https://github.com/Eltaurus-Lt/CourseDump2022#simple-import-without-media) with a couple of exeptions:
1. You need to move all media files from the course subfolder they have been downloaded to into your Anki's `collection.media` folder. The default path on different systems is as follows:
    * Windows: `%APPDATA%\\Anki2\\[your Anki username]\\collection.media`
    * Mac: `~/Library/Application Support/Anki2/[your Anki username]/collaction.media` (the Library folder is hidden by default, but can be revealed in Finder by holding down the option key while clicking on the Go menu)
    * Linux: `~/.local/share/Anki2/[your Anki username]/collection.media` for native installs or `~/.var/app/net.ankiweb.Anki/data/Anki2/[your Anki username]/collection.media` for flatpak installs
2. In order to facilitate the further editing of cards in Anki, the extension lists media files as separate fields. Because of that, you will need a Note Type with more then two fields to be used in [step 3.1](https://github.com/Eltaurus-Lt/CourseDump2022#simple-import-without-media). If you don't have such Note Type in mind already (the Basic ones will not suffice in this case), you have two options:
    * Use a template provided by the Extension as basis for your new Note Type (which you will be able to adjust afterwards to your liking). In order to import templates into your Anki doubleclick the `.apkg` file found in the [***CourseDump2022-main*** folder](https://github.com/Eltaurus-Lt/CourseDump2022#downloading-from-github) (or go to `File` -> `Import` and then select the `.apkg` file). It will create two Note Types for you - `Basic (with media)` and `Basic (and reversed card with media)` (the difference is in the types of questions they've been set up to produce) - any of these two can be used for improting `.csv` tables with audio and video fields. On top of that, importing the `.apkg` file adds a deck with two example cards into your Anki collection. This deck and the cards can be safely deleted right after, if you don't need them. 
    * Modify an existing Note Type adding {{Audio}} and {{Video}} fields as needed. To do so:
        2.1. In *Anki* go to `Tools` -> `Manage Note Types`, select a Note Type you would like to edit from the list (e.g. the same `Basic` one), then press `Fields` -> `Add, and type a name (e.g. _Audio_). Repeat the adding if you need the _Video_ field as well. <br><sub>You might want to clone the existing Note Type before adding fields though, so as to preserve the original. For that, instead of just selecting the Note Type from the list, click Add, select the Note Type from the list there and enter a new name, then proceed to adding fields to the new Note Type.</sub>

For further editing of any of the Note Types please refer to [this section of Anki manual](https://docs.ankiweb.net/templates/fields.html#basic-replacements). 

If you encounter any errors, have further questions regarding the extention or need any help with using the downloaded materials in Anki, please leave a comment in this thread: [Memrise2Anki Replacement](https://community.memrise.com/t/memrise2anki-replacement/77107)
