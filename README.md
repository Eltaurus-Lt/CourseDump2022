# Memrise Course Dump
This **Google Chrome** extension downloads word lists from [**Memrise**](https://memrise.com/) courses as `.csv` spreadsheets along with all the associated <ins>audio</ins> and <ins>video</ins> files. It also supports [batch download](https://github.com/Eltaurus-Lt/CourseDump2022#batch-download) of Memrise courses. The format of the downloaded data is suitable for subsequent import into [**Anki**](https://apps.ankiweb.net/). 

The extension *does not* download personal study data (although such functionality can be added if requested). It also does not download the words you have marked as "ignored" on Memrise. You might want to unignore them before downloading a course or make a separate clean Memrise account specifically for downloading data from it.

## Downloading the Extension
At the top of this page click `Code` and then `Download ZIP` (Note, that the `Code` button might be hidden if your browser window is not wide enough)
<p><picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212448145-e33acf96-fbb7-4ee0-8f70-89d142582797.png">
  <img src="https://user-images.githubusercontent.com/93875472/212447995-ec0370a5-af67-4a7b-96ec-b7eb2dd4e803.png">
</picture></p>

## Installation
1. [Download](https://github.com/Eltaurus-Lt/CourseDump2022/archive/refs/heads/main.zip) the ***CourseDump2022-main.zip*** archive and extract ***CourseDump2022-main*** folder from it. At this step, you can move the extension folder to any place in your filesystem.
2. In *Google Chrome* click the `Extensions` button <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212448200-3a586992-2920-4d91-ae1b-aa7526b72d2a.png"><img src="https://user-images.githubusercontent.com/93875472/197036859-7c3ff1ab-a171-4408-8255-29ba6d8d8139.png" alt="Chrome extension icon"></picture> and then <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212448898-d8025f31-6981-482c-8c71-07d071ad97f7.png"><img src="https://user-images.githubusercontent.com/93875472/197037928-6c6c52f9-472f-44c0-9cbd-ef18d6a2cdda.png" alt="Manage extensions"></picture><br> 
  (alternatively go to the Main menu <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212449149-6576e8ca-38a7-471d-8f26-53e9bfe996f3.png"><img src="https://user-images.githubusercontent.com/93875472/197037696-a6258293-5de9-42c7-b971-d430abc5c7c5.png" alt="`Menu`"></picture> in the top right corner and click `More tools` -> `Extensions`) 
3. Enable `Developer mode` (top right corner of the page)<br> <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212449257-162c735c-4d62-4ccf-957d-af045aaa1115.png"><img src="https://user-images.githubusercontent.com/93875472/197039106-acc2abba-2a2d-4b4f-acc6-e2708341fc74.png" alt="Developer mode off->on"></picture>
4. Choose `Load unpacked` (top left corner of the page) and select the ***CourseDump2022-main*** folder extracted in step 1
5. (_optional_) Click the `Extensions` button from step 2 again and pin the extension to the toolbar by clicking the pin button<p>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212449407-f1b77649-57aa-4cdb-a713-c806a305d77b.png"><img src="https://user-images.githubusercontent.com/93875472/212449403-dee8e3df-36d6-42f0-bda6-85619813c0d4.png"></picture></p>

## Downloading a Memrise Course
1. Make sure you are logged in on [Memrise](https://memrise.com/)
2. Navigate to any page belonging to a course you want to download ([example-1](https://app.memrise.com/course/1105/speak-esperanto-like-a-nativetm-1/), [example-2](https://app.memrise.com/course/2021573/french-1/3/))
3. If you are downloading a course with a lot of media files, make sure you have the option `Ask where to save each file before downloading` in the **Chrome** settings (chrome://settings/downloads) disabled
4. Simply **click the extension icon** <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212484466-55d630f7-763b-44a9-a858-a7a8c5898948.png"><img src="https://user-images.githubusercontent.com/93875472/197039734-bd2efdf8-a6c6-4327-8617-f2d3a95fcb3a.png" alt="CourseDump2022 icon"></picture> on the toolbar
    <br>(if you skipped the last installation step, click the `Extensions` button <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212448200-3a586992-2920-4d91-ae1b-aa7526b72d2a.png"><img src="https://user-images.githubusercontent.com/93875472/197036859-7c3ff1ab-a171-4408-8255-29ba6d8d8139.png" alt="Chrome extension icon"></picture> and then <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212484476-4de62d82-525e-40cc-80ba-6901aa3398ea.png"><img src="https://user-images.githubusercontent.com/93875472/197040206-6c5298bd-0f68-418d-9efb-a3ce1b8d275d.png" alt="`CourseDump2022`"></picture>)
 
After that you should see a progress bar at the top, indicating the progress of the extension scanning the course's page:

<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212484712-9d9627cd-6766-4b45-af46-4809fc646dbf.png">
 <img src="https://user-images.githubusercontent.com/93875472/212484716-a5f3cb78-c150-438b-85a8-f8a6ad30d7ad.png">
</picture></p>

When the scanning is complete, the bar will start to fill with yellow, as the extension sends the `.csv` file, course metadata, and media files (if you choose to download them) to *Google Chrome* download queue. The downloaded files should appear in your downloads directory, in a subfolder named with the course's name and id, as well as the name of the author.

### Batch download

1. Make a list of urls of the Memrise courses to download in the `queue.txt` file found in the extension folder (make sure to write full urls, including the name of a course after its number – the examples are provided in the file)
2. Set `"batch_download": true` ([changing settings](https://github.com/Eltaurus-Lt/CourseDump2022#settings))
3. During the batch download the option of downloading media is defined by `always_download_media` parameter. So set `"always_download_media": true` to download all media files or `"always_download_media": false` to download none
4. Open any [Memrise](https://memrise.com/) page and make sure you are logged in
5. Click the extension icon <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212484466-55d630f7-763b-44a9-a858-a7a8c5898948.png"><img src="https://user-images.githubusercontent.com/93875472/197039734-bd2efdf8-a6c6-4327-8617-f2d3a95fcb3a.png" alt="CourseDump2022 icon"></picture> 

## Importing into Anki

### Simple import without media
1. In *Anki* click `File` and then `Import`
2. Navigate to the `.csv` file created after [step 3 of downloading a course](https://github.com/Eltaurus-Lt/CourseDump2022#downloading-a-memrise-course)
3. Adjust the import settings:
    1. Indicate the Note Type you want to use in the `Type` field (if you don't have any particular Note Type in mind, the `Basic` one will do)
    2. In the `Deck` field select the Deck you want cards to go into (you can create a new one from this menu by clicking a deck name after the `Deck` field and then `Add`)
    3. Check the `Field mapping`<p> 
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212490785-8b6e6090-91e8-4a80-a8af-8d836deedde2.png">
 <img src="https://user-images.githubusercontent.com/93875472/198799349-feb5d729-c33a-41e7-aa24-3d1af37e2943.png"></picture></p>
  By default, the last column in `.csv` is filled with tags. All the fields from `.csv` that you don't want to import into Anki can be left out by selecting `Change` -> `Ignore field`. 


After you click the `Import` button you should see a message indicating how many notes have been imported:<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212490967-8432863f-f8de-4f52-9809-8cd23d5d2dd5.png">
 <img src="https://user-images.githubusercontent.com/93875472/196944166-5fbbfec8-2415-46cd-919a-73330ca67dbb.png" alt="Anki Import report">
</picture></p>
You can compare this number against the total number of words in the Memrise course you've been downloading. You can also check out the imported notes after clicking `Close` by going to `Browse` and selecting your deck in the deck list on the left side 
<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212490894-37ffd17e-d4c4-4d21-a9d1-a54430bf6f73.png">
 <img src="https://user-images.githubusercontent.com/93875472/196944394-95712a57-c13c-4bf2-bce3-574e55c02a1b.png" alt="Anki Browser Deck list">
</picture></p>


### Full import with media
The overall process is the same as [importing without media](https://github.com/Eltaurus-Lt/CourseDump2022#simple-import-without-media) with two differences:
1. You need to move all media files from the course `..._media` subfolder they have been downloaded into to your Anki's `collection.media` folder. The default path on different systems is as follows:
    * Windows: `%APPDATA%\\Anki2\\[your Anki username]\\collection.media`
    * Mac: `~/Library/Application Support/Anki2/[your Anki username]/collection.media` (the Library folder is hidden by default, but can be revealed in Finder by holding down the option key while clicking on the Go menu)
    * Linux: `~/.local/share/Anki2/[your Anki username]/collection.media` for native installs or `~/.var/app/net.ankiweb.Anki/data/Anki2/[your Anki username]/collection.media` for flatpak installs
    
    **Note**, that you should move the files themselves, [**without the subfolder**](https://docs.ankiweb.net/importing.html#importing-media) containing them.
2. In order to facilitate the further editing of cards in Anki, the extension lists media files in the spreadsheets as separate columns. Because of that, you will need a Note Type with more than two fields to be used for [step 3.i. of importing](https://github.com/Eltaurus-Lt/CourseDump2022#simple-import-without-media). If you don't already have such Note Type in mind (the `Basic` ones will not suffice in this case), you have two options:
    * Use one of the templates provided by the Extension as a basis for your new Note Type (which you will be able to adjust to your liking at any point). In order to import templates into your Anki double-click the `Anki Templates.apkg` file found in the [***CourseDump2022-main***](https://github.com/Eltaurus-Lt/CourseDump2022#downloading-from-github) folder (or go to `File` -> `Import` in *Anki* and then select the `.apkg` file). It will create three Note Types for you - `Basic (with media)`, `Basic (and reversed card with media)`, and `Basic (reading, writing, and listening)` (the difference is in the number and types of questions they've been set up to produce) - any of these three can be used for importing `.csv` tables with audio and video fields. <br><sub>On top of that, importing the `Anki Templates.apkg` file adds a deck with three example cards to your Anki collection. This deck and the cards can be safely deleted right after if you don't need them.</sub> 
    * Modify an existing Note Type adding _Audio_ and/or _Video_ fields. To do so:
        1. In *Anki* go to `Tools` -> `Manage Note Types`
        2. Select a Note Type you would like to edit from the list (e.g. the `Basic` one)
        3. Press `Fields` then `Add` buttons, and type a name (e.g. _Audio_. Repeat the adding for _Video_ and other extra fields as needed). <br><sub>You might want to clone the existing Note Type before adding fields though, so as to preserve the original. For that, before step b.: click Add -> select the Note Type from the list to clone -> `OK` -> enter a new name -> `OK` -> go to step b. and select the new Note Type.</sub>

    You might also want to look at [this template](https://github.com/Eltaurus-Lt/Anki-Card-Templates) to create Anki cards, which look and function similarly to the original Memrise courses.

    For additional information regarding the Note Types editing please refer to [this section of Anki manual](https://docs.ankiweb.net/templates/fields.html#basic-replacements). 
    
A typical `Field mapping` for importing with media looks like this:
<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212491138-c8fdaf65-f666-4af9-bf71-db6b6cc8bed7.png">
 <img src="https://user-images.githubusercontent.com/93875472/200242551-5b2d4613-6cdd-4588-b472-ed24d3aac25e.png">
</picture></p>    

## Settings

The settings for the extension are stored in `settings.json` file inside the extension root folder.
For example, if you want the extension to download media by default without asking every time:
1. Open `settings.json` in any text editor 
2. Locate `"always_download_media": false` and change it to `"always_download_media": true`
3. Save the file

The other available settings that can be changed in the same way:

| option                   | description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| display_anki_help_prompt | Setting to `false` disables the popup which links to this page after the download  |
| batch_download           | Setting to `true` enables [batch download](https://github.com/Eltaurus-Lt/CourseDump2022#batch-download) of Memrise courses |
| level_tags               | Setting to `false` removes column with hierarchical `course::level` tags from `.csv` |
| extra_info               | Setting to `true` makes the extension to download additional word data and attributes if present |
| collapse_columns         | Setting to `false` leaves empty columns in the `.csv` tables, so that the numbering of fields ([step 3.iii.](https://github.com/Eltaurus-Lt/CourseDump2022#simple-import-without-media)) would always be the same: 1 - _Learned word_, 2 - _Definition_, 3 - _Audio_, 4 - _Video_, 5 - _Tags_, 6-9 - _Extra fields_. |


## Discussion
If you encounter errors, have further questions regarding the extension, or need any help with using the downloaded materials in Anki, please leave a comment in this thread: [An alternative to Memrise2Anki](https://forums.ankiweb.net/t/an-alternative-to-memrise2anki-support-thread/30084)
