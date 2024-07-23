# Memrise Course Dump
This **Google Chrome** extension downloads word lists from [**Memrise**](https://memrise.com/) courses as `.csv` spreadsheets along with all associated <ins>images</ins>, <ins>audio</ins>, and <ins>video</ins> files. It also supports [batch download](https://github.com/Eltaurus-Lt/CourseDump2022#batch-download) of Memrise courses. The format of the downloaded data is suitable for subsequent import into [**Anki**](https://apps.ankiweb.net/). 

The extension *does not* download personal study data (although it is planned to be added in the future). It also *does not* download the words you have marked as "ignored" on Memrise. You might want to unignore them before downloading a course or make a separate clean Memrise account specifically for downloading purposes.

## Downloading the Extension
At the top of this page click `Code` and then `Download ZIP` (Note, that the `Code` button might be hidden if your browser window isn't wide enough)
<p><picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212448145-e33acf96-fbb7-4ee0-8f70-89d142582797.png">
  <img src="https://user-images.githubusercontent.com/93875472/212447995-ec0370a5-af67-4a7b-96ec-b7eb2dd4e803.png">
</picture></p>

## Installation
1. [Download](https://github.com/Eltaurus-Lt/CourseDump2022/archive/refs/heads/main.zip) the ***CourseDump2022-main.zip*** archive and extract ***CourseDump2022-main*** folder from it. At this step, you can move the extension folder to any place in your filesystem.
2. In *Google Chrome* click the `Extensions` button <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212448200-3a586992-2920-4d91-ae1b-aa7526b72d2a.png"><img src="https://user-images.githubusercontent.com/93875472/197036859-7c3ff1ab-a171-4408-8255-29ba6d8d8139.png" alt="Chrome extension icon"></picture> and then <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212448898-d8025f31-6981-482c-8c71-07d071ad97f7.png"><img src="https://user-images.githubusercontent.com/93875472/197037928-6c6c52f9-472f-44c0-9cbd-ef18d6a2cdda.png" alt="Manage extensions"></picture><br> 
  (alternatively go to the Main menu <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212449149-6576e8ca-38a7-471d-8f26-53e9bfe996f3.png"><img src="https://user-images.githubusercontent.com/93875472/197037696-a6258293-5de9-42c7-b971-d430abc5c7c5.png" alt="`Menu`"></picture> in the top right corner and click `More tools` ➝ `Extensions`)
3. Enable `Developer mode` (top right corner of the page)<br> <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212449257-162c735c-4d62-4ccf-957d-af045aaa1115.png"><img src="https://user-images.githubusercontent.com/93875472/197039106-acc2abba-2a2d-4b4f-acc6-e2708341fc74.png" alt="Developer mode off->on"></picture>
4. Choose `Load unpacked` (top left corner of the page) and select the ***CourseDump2022-main*** folder extracted in step 1
5. (_optional_) Click the `Extensions` button from step 2 again and pin the extension to the toolbar by clicking the pin button<p>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212449407-f1b77649-57aa-4cdb-a713-c806a305d77b.png"><img src="https://user-images.githubusercontent.com/93875472/212449403-dee8e3df-36d6-42f0-bda6-85619813c0d4.png"></picture></p>

## 💡 Downloading a Memrise Course

>---
>1. Make sure you are logged in on [Memrise](https://community-courses.memrise.com/)
>2. Navigate to any page belonging to a course you want to download ([example-1](https://community-courses.memrise.com/community/course/1105/speak-esperanto-like-a-nativetm-1/), [example-2](https://app.memrise.com/community/course/2021573/french-1/3/))
>3. 🚩 **If you are downloading a course with a lot of media files** 🚩, make sure you have disabled the option `Ask where to save each file before downloading` in the Chrome settings (chrome://settings/downloads)
>4. Press the extension icon and then click the "Download current course" button at the top of the menu
>   
>    ![image](https://github.com/user-attachments/assets/22a70b34-e45e-4644-8ebe-e3c4bd777669)
>
>    <sub>(if you don't see the extension icon on the toolbar, click the `Extensions` button <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212448200-3a586992-2920-4d91-ae1b-aa7526b72d2a.png"><img src="https://user-images.githubusercontent.com/93875472/197036859-7c3ff1ab-a171-4408-8255-29ba6d8d8139.png" alt="Chrome extension icon"></picture> to locate it)</sub>
>
>5. \* **A download can be interrupted at any point** by pressing the `Stop ongoing download`, which will replace the `Download current course` button whenever there is a download in progress, but keep in mind that restarting a download will begin the whole process from scratch.
>---

    
 
When a download starts you should see a progress bar at the top of the course page, indicating the progress of the extension scanning the course's contents with the ratio of the levels fetched to the total number of course levels in the top-right corner:

<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/3a06cd9a-9ded-41c8-a630-fa428a8283d2">
 <img src="https://github.com/user-attachments/assets/9eaf8334-fe40-4a46-b371-7c56844719e4">
</picture></p>

The scanning will be followed by downloading all associated files (the `.csv` file containing table data of the course alongside the course metadata and media files if you choose to download them). The progress is indicated by a yellow bar with the ratio on the right showing the number of downloaded files to the total number of files in the queue.

🚧

After a download is complete, you should see the progress bar turning green:

<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/94108260-efae-4f40-820f-8cf6fae8a001">
 <img src="https://github.com/user-attachments/assets/4fedfe1c-ee0a-463f-87f0-e596f17f8bed">
</picture></p>

The downloaded files should appear in your Chrome downloads directory, in a subfolder with the name comprised of the id, name, and author of that course.

🚧

#### Checking download results

🚧 numbers of words and media files
🚧 failed downloads

### Batch download

If you have multiple courses to download, instead of going through them one by one you can add them to a queue by pressing the respective button in the "Batch download" section of the extension menu on each of the courses' pages:

![image](https://github.com/user-attachments/assets/46a0e23d-6bfb-4450-a993-0c40ceca5223)

and then download all queued courses at once by clicking the "Download all" button (the numeral in brackets indicates the total number of currently queued courses):

![image](https://github.com/user-attachments/assets/d6ca790c-58c4-4ef1-95ea-2dfece5ae42c)

<sub>Note, that the download should still be initiated from (any) Memrise page since the extension needs your login to access the data.</sub>
During the scanning phase of a batch download the progress for each course is displayed on a separate progress bar, marked by a course's name, with the total scanning progress showing on a separate bar at the bottom. The file download phase proceeds as usual, with files from all the courses being processed as a single large file queue:

🚧

If you have a list of courses in a text file somewhere (from one of the previous versions of the extension, for example), you can import it with the "Import course list" menu button:

![image](https://github.com/user-attachments/assets/e2b49059-dd30-4c98-a2a0-0de78c07c32d)

The extension will accept practically any course url format (with the lines, not recognized as valid course urls being treated as text comments)
<details>
<summary>examples</summary>
  
  ```
  https://community-courses.memrise.com/community/course/234546/breaking-into-japanese-literature/
  https://community-courses.memrise.com/community/course/1098515/german-4
  https://community-courses.memrise.com/community/course/1136018/
  a plain-text comment
  https://community-courses.memrise.com/community/course/1098188
  community-courses.memrise.com/community/course/1891054/japanese-5/
  https://community-courses.memrise.com/aprender/learn?course_id=5591215?recommendation_id=5144c220-f6cb-42d1-a677-ef922e3ddcb6
  https://community-courses.memrise.com/aprender/review?category_id=963
  community-courses.memrise.com/community/course/1136234/russisch-3
  
  community-courses.memrise.com/community/course/1136236
  https://community-courses.memrise.com/community/course/43290/advanced-english-for-native-speakers/2/
  community-courses.memrise.com/community/course/867/
  ```
</details>
  
Just make sure that each course url is placed on a separate line, and points to an existing course page. The latter might not be the case if, for example, your link was saved before Memrise moved the community courses (you can try updating community courses urls by autoreplacing `app.` domains in your list with `community-courses.`). 
Note, that duplicate courses are removed from the queue, which might result in the number of courses in the queue after import being less than the number of entries in the source text file.
The list of currently queued courses can be displayed by pressing the "View queued courses" button (opens in a new tab):

![image](https://github.com/user-attachments/assets/41777822-5d6b-42ca-9106-fb34ef0285dc)

This can also be used for editing the list by copy-pasting it to a text editor, making the necessary changes and then reimporting the result as a text file through the process described above.

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

### Basic settings include the following toggles:

![image](https://github.com/user-attachments/assets/cb0f8d77-7101-4b4e-819d-f964d5516c81)

1. **Download media**: Enables downloading images, audio, and video files associated with a Memrise course
2. **Extra fields**: Enables downloading all fields found in a course. Typical examples include "part of speech", "sample sentence", "transcription", "literal translation", etc. The labels for each field can be found in the downloaded `.csv` file. Turning this option off will limit fields to the basic set of the "Learnable", "Definition", "Audio", "Video", and "Tags" (the latter three can be also excluded by the respective settings)
3. **Level tags**: Enables saving level structure of a Memrise course in a separate column in the format `course_name::level##` automatically converted to [hierarchical tags](https://docs.ankiweb.net/editing.html?highlight=tags#using-tags) when imported in Anki
4. **Anki import prompt**: Enables a popup leading to this readme page after each download. If you are reading this, you already successfully found your way here and might want to turn it off

### Advanced settings section:

![image](https://github.com/user-attachments/assets/f90301a8-538a-44b6-9ffb-734b4e5f5bc8)

5. **Learnable IDs**: Appends an additional column to the course spreadsheet containing a unique ID for each item. Can be used to manage duplicates inside Anki (if imported into the sorting field), or to cross-reference against other Memrise data downloaded separately, such as [archived mems](https://github.com/Eltaurus-Lt/MemDump)
6. **Video files**: Allows excluding video files from a download: when turned off overwrites `Download media` setting for video files while leaving images and audio files unaffected (has no effect if the `Download media` toggle is turned off)
7. **Skip media download**: Allows skipping media files during the file download phase. In contrast to the `Download media` setting, does not remove the respective columns from the spreadsheet when turned off. Can be helpful if a course spreadsheet needs to be updated by downloading it with different settings without downloading the whole media folder again.
8. **Course metadata**: In addition to the course spreadsheet and media downloads three meta files: an `info.md` file containing text description of a course, a course thumbnail image, and a course author's avatar. When turned off, the course's spreadsheet and media folder (when applicable) will be placed directly into the Chrome download folder, instead of being bundeled together with meta files in a separate course folder.

## Discussion
If you encounter errors, have further questions regarding the extension, or need any help with using the downloaded materials in Anki, please leave a comment in this thread: [An alternative to Memrise2Anki](https://forums.ankiweb.net/t/an-alternative-to-memrise2anki-support-thread/30084)
