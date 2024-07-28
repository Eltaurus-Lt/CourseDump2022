# Memrise Course Dump
This **Google Chrome** extension downloads word lists from [**Memrise**](https://memrise.com/) courses as ".csv" spreadsheets along with all associated <ins>images</ins>, <ins>audio</ins>, and <ins>video</ins> files. It also supports [batch download](https://github.com/Eltaurus-Lt/CourseDump2022#batch-download) of Memrise courses. The format of the downloaded data is suitable for subsequent import into [**Anki**](https://apps.ankiweb.net/). 

The extension *does not* download personal study data (although it is planned to be added in the future). It also *does not* download the words you have marked as "ignored" on Memrise. You might want to unignore them before downloading a course or make a separate clean Memrise account specifically for downloading purposes.

## Downloading the Extension
At the top of this page click `Code` and then `Download ZIP` (Note, that the `Code` button might be hidden if your browser window isn't wide enough)
<p><picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212448145-e33acf96-fbb7-4ee0-8f70-89d142582797.png">
  <img src="https://user-images.githubusercontent.com/93875472/212447995-ec0370a5-af67-4a7b-96ec-b7eb2dd4e803.png">
</picture></p>

## Installation
1. [Download](https://github.com/Eltaurus-Lt/CourseDump2022/archive/refs/heads/main.zip) the ***CourseDump2022-main.zip*** archive and extract ***CourseDump2022-main*** folder from it. At this step, you can move the extension folder to any place in your filesystem.
2. In *Google Chrome* click the `Extensions` button <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/6cca563b-8149-421b-a217-0664c3b872f2"><img src="https://github.com/user-attachments/assets/89838937-f887-4aa7-bff9-9f5293fa04cb" alt="Chrome extension icon"></picture> and then <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/bff14d50-3a4c-4b89-be0a-a739beeb111c"><img src="https://github.com/user-attachments/assets/d07bfc2b-e281-4e79-bf9f-5bc5f9c50611" alt="Manage extensions"></picture><br> 
  <sub>(alternatively go to the Main menu <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/f36fcb90-886f-4445-98e9-7fb5d81646e1"><img src="https://github.com/user-attachments/assets/eb8d2e95-82d3-46ae-ad96-35e6d3db159b" alt="`Menu`"></picture> in the top right corner and click `Extensions` → `Manage Extensions`)</sub>
3. Enable `Developer mode` (top right corner of the page)<p>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/ff2313c8-a790-4dde-acb3-b538fafea92e"><img src="https://github.com/user-attachments/assets/52171083-6c1b-43cd-a5ea-17540b74265b" alt="Developer mode off->on"></picture></p>
4. Choose `Load unpacked` (top left corner) and select the ***CourseDump2022-main*** folder extracted in step 1
5. (_optional_) Click the `Extensions` button from step 2 again and pin the extension to the toolbar by clicking the pin button<p>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/bc69c932-19a1-4ada-9c9d-e8dfd32ee000"><img src="https://github.com/user-attachments/assets/cc502262-e429-44c2-a5c2-fb277cec67c4"></picture></p>

## 💡 Downloading a Memrise Course

>---
>1. Make sure you are logged in on [Memrise](https://community-courses.memrise.com/)
>2. Navigate to any page belonging to a course you want to download ([example-1](https://community-courses.memrise.com/community/course/1105/speak-esperanto-like-a-nativetm-1/), [example-2](https://app.memrise.com/community/course/2021573/french-1/3/))
>3. 🚩 **If you are downloading a course with a lot of media files** 🚩, make sure you have disabled the option `Ask where to save each file before downloading` in the Chrome settings (chrome://settings/downloads)
>4. Press the extension icon and then click the "Download current course" button at the top of the menu
>   
>    <p><picture>
>       <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/8fac02f4-3940-4092-8125-58c4cb1ac4ca">
>       <img src="https://github.com/user-attachments/assets/21b49afd-ac4a-4b23-8f65-c179a46c2a37">
>    </picture></p>
>
>    <sub>(if you don't see the extension icon on the toolbar, click the `Extensions` button <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/6cca563b-8149-421b-a217-0664c3b872f2"><img src="https://github.com/user-attachments/assets/89838937-f887-4aa7-bff9-9f5293fa04cb" alt="Chrome extension icon"></picture> to locate it)</sub>
>
>5. \* **A download can be interrupted at any point** by pressing the `Stop ongoing download`, which will replace the `Download current course` button whenever there is a download in progress, but keep in mind that restarting a download will begin the whole process from scratch.
>---

    
 
When a download starts you should see a progress bar at the top of the course page, indicating the progress of the extension scanning the course's contents with the ratio of the levels fetched to the total number of course levels in the top-right corner:
<sub></sub>
<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/84cbb9e0-e282-4136-86bf-18d097bf613b">
 <img src="https://github.com/user-attachments/assets/9df74fb2-b7d4-45ca-a809-8e969da2d895">
</picture></p>

The scanning will be followed by downloading all associated files (the ".csv" file containing table data of the course alongside the course metadata and media files if you choose to download them). The progress is indicated by a yellow bar with the ratio on the right showing the number of downloaded files to the total number of files in the queue:

<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/f8d413fa-411e-4df1-a485-f591d84d05a1">
 <img src="https://github.com/user-attachments/assets/3b76a258-e6c8-45d8-914c-6739db27a6fe">
</picture></p>

After a download is complete, you should see the progress bar turning green:

<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/bdcc7869-830b-43b7-995f-36403c4e0653">
 <img src="https://github.com/user-attachments/assets/0b6cb1fd-9114-4a9c-b356-da0dec19e07e">
</picture></p>

The downloaded files should appear in your Chrome downloads directory, in a subfolder with the name comprised of the id, name, and author of that course:

<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/9921a71a-d513-4112-882f-8434a302cf44">
 <img src="https://github.com/user-attachments/assets/653a14f4-ff82-4edc-af1a-217482361bee">
</picture></p>

#### Checking download results

For convenience, the names of the downloaded ".csv" file and the "...\_media" folder have the counts for the total number of the downloaded items (words) and the number of the referenced media files appended at the end in the brackets.

If the number in the spreadsheet filename appears without any additional indicators, e.g. "...\_(123).csv", you can be sure that all items (**not counting the ignored ones**) from a course have been saved successfully. If the total number of the downloaded items does not match the count displayed on the Memrise page, both will be shown to indicate an incomplete download, e.g. "...\_(42 of 58).csv". In this instance, it is worth checking the internet connection and repeating the download.

Unfortunately, Memrise displays the expected number on a course page only if the course has been started by the user or the course isn't split into levels. If this is not the case, the figure displayed in the ".csv" filename will be based on the total number of items in the levels the extension managed to scrap and prefixed with a tilde to indicate an estimation, e.g. "...\_(~77).csv". To verify that all items have been downloaded, you’ll need to compare this number to an independent evaluation (the easiest way would still be to enroll in the course by pressing the "Get started now" button, answering a couple of questions to enable the word count, and checking the main course page again to see the value displayed by Memrise).

For the media files, it is enough to compare the number at the end of the "...\_media" folder's name with the actual number of the files it contains. 
If the two do not match, some files are likely to be missing due to connection issues (either on your side or on the side of the Memrise server). In most cases, simply retrying the download can fix the problem. You should not delete files from failed attempts – the extension will keep putting the files into the same media folder, resolving potential naming conflicts, so that even on unreliable networks several partially successful attempts can yield fully recovered course media data.

<sup>In some rare cases, however, Memrise courses might contain references to files that don't exist. Attempting to download a course with a broken link will result in the progress bar turning red during the download, and the respective error appearing on the "Manage extensions" page.</sup>

### Batch download

If you have multiple courses to download, instead of going through them one by one it is more convenient to add them to a queue by pressing the respective button in the "Batch download" section of the extension menu on each of the courses' pages:

![image](https://github.com/user-attachments/assets/46a0e23d-6bfb-4450-a993-0c40ceca5223)

and then download all queued courses at once by clicking the "Download all" button (the numeral in brackets indicates the total number of currently queued courses):

![image](https://github.com/user-attachments/assets/d6ca790c-58c4-4ef1-95ea-2dfece5ae42c)

<sup>Note, that the download should still be initiated from (any) Memrise page since the extension needs an active Memrise login to access the data.</sup>

During the scanning phase of a batch download the progress for each course is displayed on a separate progress bar, marked by a course's name, with the total scanning progress showing on a separate bar at the bottom:

<p><picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/ec1e3a4f-56e0-4bf2-a127-f04d0598da70">
 <img src="https://github.com/user-attachments/assets/bdb14159-3c9c-4075-92ec-410bcac2ac62">
</picture></p>

The file download phase proceeds from there as usual, with files from all the courses being processed together as a single stack.

If you have a list of courses in a text file somewhere (from one of the previous versions of the extension, for example), it can be imported with the "Import course list" menu button:

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
  
Just make sure that each course url is placed on a separate line, and points to an existing course page. The latter might not be the case if, for example, your link was saved before Memrise moved the community courses (you can try updating community courses urls by autoreplacing "app." domains in your list with "community-courses."). 
Note, that duplicate courses are removed from the queue, which might result in the number of courses in the queue after import being less than the number of entries in the source text file.
The list of currently queued courses can be displayed by pressing the "View queued courses" button (opens in a new tab):

![image](https://github.com/user-attachments/assets/41777822-5d6b-42ca-9106-fb34ef0285dc)

This can also be used for editing the list by copy-pasting it to a text editor, making the necessary changes, and then re-importing the result as a text file through the process described above.

## Importing into Anki

>tl;dr (most basic import):
>1. Make a note type:
>    1. Open the downloaded ".csv" file → look at the number and names of the columns
>    2. In Anki press `Tools` (top left menu) → `Manage Note Types` → `Add` → `Add: Basic` → put in a name (e.g. "Memrise - Japanese") → `OK` → `Fields` → add new/rename existing ones to match the columns from the ".csv" file ("Level tags" column excluded) → `Save` → close the window
>2. Make a deck: press `Create Deck` (bottom center of the main Anki screen) → put in the course's name → `OK`
>3. Import the spreadsheet: `File` (top left menu) → `Import` → browse to the ".csv" file → `Open` → set the `Notetype` and `Deck` (Import options section) to the ones created in the steps 1 and 2 → `Import` (top right corner) → wait for import to finish → close the window
>4. Move the media files (if the course has any): `Tools` (top left menu) → `Check Media` → `View Files` (bottom left corner) → copy all files **from inside** your downloaded course's "..._media" subfolder to the opened "collection.media" one → close all windows

### 1. Choosing a note type

_Note types_ are, essentially, the Anki equivalent of Memrise database templates (with course-level settings and card templates packed inside). 
The important thing at this step is to prepare such a **template with enough fields to accommodate all required columns of the imported course** (anything else can be modified afterward).
You can check what columns a course has by opening the downloaded ".csv" file and looking at the row that starts with "#columns:" at the top of the table.

There are several alternative ways you can go from here:

1. [Create a new note type](https://docs.ankiweb.net/editing.html#adding-a-note-type) by adding the required number of fields:
    1. Press `Tools` (top left menu) → `Manage Note Types`
    2. `Add` → `Add: Basic` (or clone any other template you wish to use as a basis)
    3. Put in a name such as "Memrise – German" (if you are importing several courses on the same language/topic with similar level structure you can use the same note type for all of them – it will make managing cards easier in the long run) → `OK`
    4. Press `Fields` → `Add` to add new fields up to the number of columns from the ".csv" file (ignore the "Level tags" column – it is special and does not require a field for import). Names for fields and columns do not have to match, but it is a good idea to keep them the same. You can rename existing fields by selecting them and pressing `Rename` → When finished, press `Save` and close the window
   
   Keep in mind, that **in order to see the content of a field during reviews, you will also have to edit the card templates** and put the field on the respective side of a card (refer to [the Anki manual](https://docs.ankiweb.net/templates/intro.html) for all the necessary steps; when in doubt, feel free to ask, even basic, questions on [the forum](https://forums.ankiweb.net/)).
2. Use **the dedicated [Memrise template](https://github.com/Eltaurus-Lt/Anki-Card-Templates?tab=readme-ov-file#memrise)**, which replicates the original Memrise design and most of its functionality. The template is set to have five fields by default: "Learnable", "Definition", "Audio" + two extra fields. The instructions for adding more fields or renaming the existing ones can be found in [the customization section](https://github.com/Eltaurus-Lt/Anki-Card-Templates?tab=readme-ov-file#customization).
    <p><picture>
       <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/57c646dc-0a49-4dfc-a5ea-e46a13bcd5b3">
       <img src="https://github.com/user-attachments/assets/f106c0a0-0c0b-4ca1-9cd7-6c54105289dd" width="50%">
    </picture></p>
3. For importing the most basic data (learnable + definition) – any note type will do, and you can simply use Anki's "Basic" one without any modifications.

   For basic data with media (audio and video) you can use any of the templates provided with the Extension – "Basic (with media)", "Basic (and reversed card with media)", "Basic (reading, writing, and listening)", which differ in the number and types of questions they've been set up to produce. To import the templates:
   
   1. Double-click the `Anki Templates.apkg` file found in the [***CourseDump2022-main***](https://github.com/Eltaurus-Lt/CourseDump2022#downloading-from-github) folder (alternatively, press `File` → `Import` inside Anki and browse to the `.apkg` file)
   2. The previous step creates an example deck with three cards in your Anki collection. This deck and the cards can be safely deleted right away if you don't need them.

   For making any adjustments to these templates refer to point 1 of this list
4. Look for a template elsewhere. Anki templates are distributed freely by users and can be found all over the internet. [AnkiWeb](https://ankiweb.net/shared/decks?search=template) is a good place to start

### 2. Making a deck (optional)

Create a new deck for storing the cards made from the course:

1. Press `Create Deck` at the bottom of the main screen:
    <p><picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/e4c10846-62cf-461c-90a8-4bf0c264077b">
     <img src="https://github.com/user-attachments/assets/a985d8a8-c0bb-4909-ae83-341b6c97e94a">
    </picture></p>
  
2. Put in the name of the course (you can copy the full name from the downloaded `info.md` file) → press `OK`
3. You can also set the course description found in the same `info.md` as the deck description:
    1. Open the deck by clicking on its name
        <p><picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/181e7746-4c0b-4da9-a8d0-424b7cb3c950">
          <img src="https://github.com/user-attachments/assets/2bf808a4-b2f0-4b01-9556-31b7392a775b">
        </picture></p>
    2. Press `Description` at the bottom of the screen
        <p><picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/87b28a6b-aa58-43a0-841b-3f8340e40c9f">
          <img src="https://github.com/user-attachments/assets/236facaf-5360-496b-8a05-d229c2171648">
        </picture></p>
    3. Copy the relevant text in the appeared window
4. To set a thumbnail you can use [this addon](https://github.com/Eltaurus-Lt/Lt-Anki-Addons/tree/main/Lstyle) and the image from the downloaded course folder.

Note, that decks can be nested inside each other (via drag-and-drop) to group courses' decks by language/topic or subdivide a deck into subdecks representing levels. However, in Anki, you are able to quickly search for items from any course/level using tags even if you skip this step entirely and don't make a separate deck for each course.

### 3. Importing the spreadsheet

1. Press `File` (top left menu) → `Import`
2. Browse to the ".csv" file in [the downloaded course's folder](https://github.com/Eltaurus-Lt/CourseDump2022#downloading-a-memrise-course) → `Open`
3. Verify that the table in the "File" section looks good and set the `Notetype` and `Deck` in the "Import options" section below to the ones prepared in the previous steps:
    <p><picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/a8aa02d0-6648-4b39-836e-8858e1c8e764">
     <img src="https://github.com/user-attachments/assets/31cfc540-4301-49ea-a7f3-503e2aa02096" alt="Anki Browser Deck list">
    </picture></p>
4. Scroll down and adjust the "Field Mapping". This tab defines the correspondence between the Anki field names and the former Memrise field names (spreadsheet columns). All the matching names will be mapped to each other automatically (so you can skip this step if you named the fields in the chosen note type accordingly). The rest can be set up manually on the right side of the tab, by selecting the column names next to the names of the Anki fields, into which you would like to put the respective data. Columns that are not mapped to any fields will be skipped during import.
    <p><picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/a945f12e-803c-482e-bc88-40be14566fff">
     <img src="https://github.com/user-attachments/assets/7f74b6c9-f47c-41b5-9aa7-31f5f0c3e70c">
    </picture></p>
5. Press `Import` in the top right corner. After the processing is done, you will see a report screen, with the "Overview" section indicating the overall count of imported notes:
    <p><picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/d5190b9c-5d2e-4ad4-a4ed-1040da3102d5">
     <img src="https://github.com/user-attachments/assets/01dead5d-e113-4a57-8cc7-ec77f09c7804" alt="Anki Import report">
    </picture></p>
    You can check it against [the total number of items in the course](https://github.com/Eltaurus-Lt/CourseDump2022#checking-download-results). The "Details" section below will contain information on each individual note from the spreadsheet.
    
    You will also be able to see the imported notes at any time by going to `Browse` (top center menu) and selecting your deck in the deck list on the left side 
    <p><picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/378820b7-79f4-4485-9eec-aa97fb105e02">
     <img src="https://github.com/user-attachments/assets/f87e25db-0e36-426c-a2d7-a9f6f3feda7d">
    </picture></p>

### 4. Moving media files

1. To locate the "collection.media" folder, in which Anki stores all media files, press `Tools` (top left menu) → `Check Media` → `View Files` (bottom left corner)

    <details>
    <summary>The default paths on different systems for opening the folder manually:</summary>
      
        * Windows: `%APPDATA%\Anki2\[your Anki username]\collection.media`
        * Mac: `~/Library/Application Support/Anki2/[your Anki username]/collection.media` (the Library folder is hidden by default, but can be revealed in Finder by holding down the option key while clicking on the Go menu)
        * Linux: `~/.local/share/Anki2/[your Anki username]/collection.media` for native installs or `~/.var/app/net.ankiweb.Anki/data/Anki2/[your Anki username]/collection.media` for flatpak installs
    </details>   

2. Move all the files from the course's "..._media" subfolder into the "collection.media" folder. Note, that you should move the files themselves, [**without the subfolder**](https://docs.ankiweb.net/importing.html#importing-media) containing them

   To verify that all media files are properly referenced, after they have been completely moved close and reopen the `Tools` → `Check Media` window. If you don't see any missing or unused files from the imported course, everything is alright.
    

## Settings

### Basic

![image](https://github.com/user-attachments/assets/cb0f8d77-7101-4b4e-819d-f964d5516c81)

1. **Download media**: Enables downloading images, audio, and video files associated with a Memrise course
2. **Extra fields**: Enables downloading all fields found in a course. Typical examples include "part of speech", "sample sentence", "transcription", "literal translation", etc. The labels for each field can be found in the downloaded ".csv" file. Turning this option off will limit fields to the basic set of the "Learnable", "Definition", "Audio", "Video", and "Tags" (the latter three can be also excluded by the respective settings)
3. **Level tags**: Appends an additional column that saves Memrise course level structure in the format `course_name::level##`, which is automatically converted to [hierarchical tags](https://docs.ankiweb.net/editing.html?highlight=tags#using-tags) in Anki during import
4. **Anki import prompt**: Enables a popup leading to the current readme page after each download. If you are reading this, you already successfully found your way here and might want to turn it off

### Advanced

![image](https://github.com/user-attachments/assets/f90301a8-538a-44b6-9ffb-734b4e5f5bc8)

5. **Learnable IDs**: Appends an additional column to the course spreadsheet containing a unique ID for each item. Can be used to manage duplicates inside Anki (if imported into the sorting field), or to cross-reference against other Memrise data downloaded separately, such as [archived mems](https://github.com/Eltaurus-Lt/MemDump)
6. **Video files**: Allows excluding video files from a download: when turned off overwrites the `Download media` setting for video files while leaving images and audio unaffected (has no effect if the `Download media` toggle is turned off)
7. **Skip media download**: Allows skipping media files during the file download phase. In contrast to the `Download media` setting, does not remove the respective columns from the spreadsheet when turned off. It can be helpful if a course spreadsheet needs to be recompiled with different settings without downloading the whole media folder again
8. **Course metadata**: Enables downloading three metadata files in addition to the basic spreadsheet and media: an `info.md` file containing the text description of a course, the course's thumbnail image, and the course author's avatar. When turned off, the ".csv" spreadsheet and respective media folder (when applicable) will be placed directly into the Chrome download folder, instead of being bundled together with meta files in a separate course folder

## Discussion
If you encounter errors, have further questions regarding the extension, or need any help with using the downloaded materials in Anki, please leave a comment in this thread: [An alternative to Memrise2Anki](https://forums.ankiweb.net/t/an-alternative-to-memrise2anki-support-thread/30084)
