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
<sub></sub>
<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/84cbb9e0-e282-4136-86bf-18d097bf613b">
 <img src="https://github.com/user-attachments/assets/9df74fb2-b7d4-45ca-a809-8e969da2d895">
</picture></p>

The scanning will be followed by downloading all associated files (the `.csv` file containing table data of the course alongside the course metadata and media files if you choose to download them). The progress is indicated by a yellow bar with the ratio on the right showing the number of downloaded files to the total number of files in the queue.

<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/f8d413fa-411e-4df1-a485-f591d84d05a1">
 <img src="https://github.com/user-attachments/assets/3b76a258-e6c8-45d8-914c-6739db27a6fe">
</picture></p>

After a download is complete, you should see the progress bar turning green:

<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/bdcc7869-830b-43b7-995f-36403c4e0653">
 <img src="https://github.com/user-attachments/assets/0b6cb1fd-9114-4a9c-b356-da0dec19e07e">
</picture></p>

The downloaded files should appear in your Chrome downloads directory, in a subfolder with the name comprised of the id, name, and author of that course.

🚧

#### Checking download results

Memrise only displays the total number of items in a course beforehand if the course has been started by the user, or it is not divided into separate levels.

If such a number is available it will be shown in brackets, e.g. ..._(123).csv. If you see that, you can be sure that all items (except the ignored ones!) from a course have been saved successfully (to verify that all media files have been successfully downloaded as well, you’ll need to compare the similar number at the end of the ..._media folder with the number of files inside it).

If the apriori number is not available, the displayed figure will be based on the total number of items in the levels the extension managed to scrap and prefixed with a tilda to indicate an estimation, e.g. ..._(~77).csv. To verify that all items have been downloaded, you’ll have to compare this number to some independent evaluation (the easiest way would still be to press the Get started now button on the course page and check the value calculated by Memrise itself).

If the number of items is available, but does not match the total number of downloaded items, both of them will be shown to indicate an incomplete download, e.g. ..._(42 of 58).csv. In such a case it’s worth checking the internet connection and repeating the download (no need to delete the files from the previous attempt or reload the page).

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

This can also be used for editing the list by copy-pasting it to a text editor, making the necessary changes, and then re-importing the result as a text file through the process described above.

## Importing into Anki

>tl;dr (most basic import):
>1. Make a note type:
>    1. Open the downloaded `.csv` file → look at the number and names of the columns
>    2. In Anki press `Tools` (top left menu) → `Manage Note Types` → `Add` → `Add: Basic` → put in a name (e.g. "Memrise - Japanese") → `OK` → `Fields` → add new/rename existing ones to match the columns from the `.csv` file ("Level tags" column excluded) → `Save` → close the window
>2. Make a deck: press `Create Deck` (bottom center of the main Anki screen) → put in the course's name → `OK`
>3. Import the spreadsheet: `File` (top left menu) → `Import` → browse to the `.csv` file → `Open` → set the `Notetype` and `Deck` (Import options section) to the ones created in the steps 1 and 2 → `Import` (top right corner) → wait for import to finish → close the window
>4. Move the media files (if the course has any): `Tools` (top left menu) → `Check Media` → `View Files` (bottom left corner) → copy all files **from inside** your downloaded course's "..._media" folder to the opened "collection.media" one → close all windows

### 1. Choosing a note type

_Note types_ are, essentially, the Anki equivalent of Memrise database templates (with course-level settings and card templates packed inside). 
The important thing at this step is to prepare such a **template with enough fields to accommodate all required columns of the imported course** (anything else can be modified afterward).
You can check what columns a course has by opening the downloaded `.csv` file and looking at the row that starts with "#columns:" at the top of the table.

There are several alternative ways you can go from here:

1. [Create a new note type](https://docs.ankiweb.net/editing.html#adding-a-note-type) by adding the required number of fields:
    1. Press `Tools` (top left menu) → `Manage Note Types`
    2. `Add` → `Add: Basic` (or clone any other template you wish to use as a basis)
    3. Put in a name such as "Memrise – Japanese" (if you are importing several courses on the same language/topic with similar level structure you can use the same note type for all of them – it will make managing cards easier in the long run) → `OK`
    4. Press `Fields` → `Add` to add new fields up to the number of columns from the `.csv` file (ignore the "Level tags" column – it is special and does not require a field for import). Names for fields and columns do not have to match, but it is a good idea to keep them the same. You can rename existing fields by selecting them and pressing `Rename` → When finished, press `Save` and close the window
   
   Keep in mind, that **in order to see the content of a field during reviews, you will also have to edit the card templates** and put the field on the respective side of a card (refer to [the  Anki manual](https://docs.ankiweb.net/templates/intro.html) for all the necessary steps; when in doubt, feel free to ask, even basic, questions on [the forum](https://forums.ankiweb.net/)).
2. Use **the dedicated [Memrise template](https://github.com/Eltaurus-Lt/Anki-Card-Templates?tab=readme-ov-file#memrise)**, which replicates the original Memrise design and most of its functionality. The template is set to have five fields by default: "Learnable", "Definition", "Audio" + two extra fields. The instructions for adding more fields or renaming the existing ones can be found in [the customization section](https://github.com/Eltaurus-Lt/Anki-Card-Templates?tab=readme-ov-file#customization). 
3. For importing the most basic data (learnable + definition) – any note type will do, and you can simply use Anki's "Basic" one without any modifications.

   For basic data with media (audio and video) you can use any of the templates provided with the Extension – "Basic (with media)", "Basic (and reversed card with media)", "Basic (reading, writing, and listening)", which differ in the number and types of questions they've been set up to produce. To import the templates:
   
   1. Double-click the `Anki Templates.apkg` file found in the [***CourseDump2022-main***](https://github.com/Eltaurus-Lt/CourseDump2022#downloading-from-github) folder (alternatively, press `File` -> `Import` inside Anki and browse to the `.apkg` file)
   2. The previous step creates an example deck with three cards in your Anki collection. This deck and the cards can be safely deleted right away if you don't need them.

   For making any adjustments to these templates refer to point 1 of this list
5. Look for a template elsewhere. Anki templates are distributed freely by users and can be found all over the internet. [AnkiWeb](https://ankiweb.net/shared/decks?search=template) is a good place to start

### 2. Making a deck (optional)

Create a new deck for storing the cards made from the course:

1. Press `Create Deck` at the bottom of the main screen:
    <p><picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/59757a1a-a8a3-4bbb-a424-26207a5d8310">
     <img src="https://github.com/user-attachments/assets/2e0c5c1d-ef79-4f9f-91d2-d0eecf727247">
    </picture></p>
  
2. Put in the name of the course (you can copy the full name from the downloaded `info.md` file) ➝ press `OK`
3. You can also set the course description from the same `info.md` as the deck description:
    1. Open the deck by clicking on its name
    2. Press `Description` at the bottom of the screen
    3. Copy the relevant text here
4. To set a thumbnail you can use [this addon](https://github.com/Eltaurus-Lt/Lt-Anki-Addons/tree/main/Lstyle) and the image from the downloaded course folder.

### 3. Importing the spreadsheet

1. In *Anki* click `File` and then `Import`
2. Navigate to the `.csv` file created after [step 3 of downloading a course](https://github.com/Eltaurus-Lt/CourseDump2022#downloading-a-memrise-course)
3. Adjust the import settings:
    1. Indicate the Note Type you want to use in the `Type` field (if you don't have any particular Note Type in mind, the `Basic` one will do)
    2. In the `Deck` field select the Deck you want cards to go into (you can create a new one from this menu by clicking a deck name after the `Deck` field and then `Add`)
    3. Check the `Field mapping` (which column from the spreadsheet goes to which field (will be automatically correlated if names coincide))<p> 
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

<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/583c08cd-5f5a-4f48-898e-c85f98d749cd">
 <img src="https://github.com/user-attachments/assets/e467fd86-9b02-4328-9d3b-3976a33f5f27" alt="Anki Browser Deck list">
</picture></p>

### 4. Moving media files

The overall process is the same as [importing without media](https://github.com/Eltaurus-Lt/CourseDump2022#simple-import-without-media) with two differences:
1. You need to move all media files from the course `..._media` subfolder they have been downloaded into to your Anki's `collection.media` folder. The default path on different systems is as follows:
    spoiler:
    * Windows: `%APPDATA%\\Anki2\\[your Anki username]\\collection.media`
    * Mac: `~/Library/Application Support/Anki2/[your Anki username]/collection.media` (the Library folder is hidden by default, but can be revealed in Finder by holding down the option key while clicking on the Go menu)
    * Linux: `~/.local/share/Anki2/[your Anki username]/collection.media` for native installs or `~/.var/app/net.ankiweb.Anki/data/Anki2/[your Anki username]/collection.media` for flatpak installs
  
   you can also find the path by going to Anki's main menu -> check media
    
    **Note**, that you should move the files themselves, [**without the subfolder**](https://docs.ankiweb.net/importing.html#importing-media) containing them.
3. In order to facilitate the further editing of cards in Anki, the extension lists media files in the spreadsheets as separate columns. Because of that, you will need a Note Type with more than two fields to be used for [step 3.i. of importing](https://github.com/Eltaurus-Lt/CourseDump2022#simple-import-without-media). If you don't already have such Note Type in mind (the `Basic` ones will not suffice in this case), you have two options:
    *  (which you will be able to adjust to your liking at any point). 
    * Modify an existing Note Type adding _Audio_ and/or _Video_ fields. To do so:
        1. In *Anki* go to `Tools` -> `Manage Note Types`
        2. Select a Note Type you would like to edit from the list (e.g. the `Basic` one)
        3. Press `Fields` then `Add` buttons, and type a name (e.g. _Audio_. Repeat the adding for _Video_ and other extra fields as needed). <br><sub>You might want to clone the existing Note Type before adding fields though, so as to preserve the original. For that, before step b.: click Add -> select the Note Type from the list to clone -> `OK` -> enter a new name -> `OK` -> go to step b. and select the new Note Type.</sub>

    For additional information regarding the Note Types editing please refer to [this section of Anki manual](https://docs.ankiweb.net/templates/fields.html#basic-replacements). 
    
A typical `Field mapping` for importing with media looks like this:
<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212491138-c8fdaf65-f666-4af9-bf71-db6b6cc8bed7.png">
 <img src="https://user-images.githubusercontent.com/93875472/200242551-5b2d4613-6cdd-4588-b472-ed24d3aac25e.png">
</picture></p>

<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/a945f12e-803c-482e-bc88-40be14566fff">
 <img src="https://github.com/user-attachments/assets/7f74b6c9-f47c-41b5-9aa7-31f5f0c3e70c">
</picture></p>

## Settings

### Basic

![image](https://github.com/user-attachments/assets/cb0f8d77-7101-4b4e-819d-f964d5516c81)

1. **Download media**: Enables downloading images, audio, and video files associated with a Memrise course
2. **Extra fields**: Enables downloading all fields found in a course. Typical examples include "part of speech", "sample sentence", "transcription", "literal translation", etc. The labels for each field can be found in the downloaded `.csv` file. Turning this option off will limit fields to the basic set of the "Learnable", "Definition", "Audio", "Video", and "Tags" (the latter three can be also excluded by the respective settings)
3. **Level tags**: Appends an additional column that saves Memrise course level structure in the format `course_name::level##`, which is automatically converted to [hierarchical tags](https://docs.ankiweb.net/editing.html?highlight=tags#using-tags) in Anki during import
4. **Anki import prompt**: Enables a popup leading to the current readme page after each download. If you are reading this, you already successfully found your way here and might want to turn it off

### Advanced

![image](https://github.com/user-attachments/assets/f90301a8-538a-44b6-9ffb-734b4e5f5bc8)

5. **Learnable IDs**: Appends an additional column to the course spreadsheet containing a unique ID for each item. Can be used to manage duplicates inside Anki (if imported into the sorting field), or to cross-reference against other Memrise data downloaded separately, such as [archived mems](https://github.com/Eltaurus-Lt/MemDump)
6. **Video files**: Allows excluding video files from a download: when turned off overwrites the `Download media` setting for video files while leaving images and audio unaffected (has no effect if the `Download media` toggle is turned off)
7. **Skip media download**: Allows skipping media files during the file download phase. In contrast to the `Download media` setting, does not remove the respective columns from the spreadsheet when turned off. It can be helpful if a course spreadsheet needs to be recompiled with different settings without downloading the whole media folder again
8. **Course metadata**: Enables downloading three metadata files in addition to the basic spreadsheet and media: an `info.md` file containing the text description of a course, the course's thumbnail image, and the course author's avatar. When turned off, the `.csv` spreadsheet and respective media folder (when applicable) will be placed directly into the Chrome download folder, instead of being bundled together with meta files in a separate course folder

## Discussion
If you encounter errors, have further questions regarding the extension, or need any help with using the downloaded materials in Anki, please leave a comment in this thread: [An alternative to Memrise2Anki](https://forums.ankiweb.net/t/an-alternative-to-memrise2anki-support-thread/30084)
