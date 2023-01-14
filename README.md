# CourseDump2022
This **Google Chrome** extension downloads word lists from [**Memrise**](https://memrise.com/) courses as `.csv` spreadsheets along with all the associated <ins>audio</ins> and <ins>video</ins> files. The format of downloaded data is suitable for further import into [**Anki**](https://apps.ankiweb.net/).

The extension is supposed to serve as a substitution for the currently defunct Anki's [Memrise2Anki](https://github.com/wilddom/memrise2anki-extension) addon.
Although it does not replicate all of the addon's functionality (e.g. in it's current state the extension does not download personal study data), the extension has several advantages over Memrise2Anki:
1. It can download video files in additon to audio
2. Allows [batch download](https://github.com/Eltaurus-Lt/CourseDump2022#batch-download) of Memrise courses
3. Works past April 2022 Memrise changes =)

## Downloading from GitHub
Click `Code` and then `Download ZIP` (Note, that the `Code` button might be hidden if your browser window is not wide enough)<p>
 <picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212448145-e33acf96-fbb7-4ee0-8f70-89d142582797.png">
  <img src="https://user-images.githubusercontent.com/93875472/212447995-ec0370a5-af67-4a7b-96ec-b7eb2dd4e803.png">
</picture>
</p>


## Installation
1. [Download](https://github.com/Eltaurus-Lt/CourseDump2022/archive/refs/heads/main.zip) the ***CourseDump2022-main.zip*** archive and extract ***CourseDump2022-main*** folder from it
2. In *Google Chrome* click the `Extensions` button <picture><source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/93875472/212448200-3a586992-2920-4d91-ae1b-aa7526b72d2a.png"><img src="https://user-images.githubusercontent.com/93875472/197036859-7c3ff1ab-a171-4408-8255-29ba6d8d8139.png"></picture> and then ![Manage extensions](https://user-images.githubusercontent.com/93875472/197037928-6c6c52f9-472f-44c0-9cbd-ef18d6a2cdda.png)<br> 
  (alternatively go to the Main menu ![`Menu`](https://user-images.githubusercontent.com/93875472/197037696-a6258293-5de9-42c7-b971-d430abc5c7c5.png) in the top right corner and click `More tools` -> `Extensions`) 
3. Enable `Developer mode` (top right corner of the page)<br> ![Developer mode off->on](https://user-images.githubusercontent.com/93875472/197039106-acc2abba-2a2d-4b4f-acc6-e2708341fc74.png)
4. Choose `Load unpacked` (top left corner of the page) and select the ***CourseDump2022-main*** folder extracted in step 1
5. (_optional_) Click the `Extensions` button from step 2 again and pin the extension to the toolbar by clicking the pin button<p>
  ![image](https://user-images.githubusercontent.com/93875472/197015305-f743eec3-2555-427e-b474-00898f4a520b.png)</p>

## Downloading a Memrise Course
1. Make sure you are logged in on [Memrise](https://memrise.com/)
2. Navigate to any page belonging to a course you want to download ([example-1](https://app.memrise.com/course/1105/speak-esperanto-like-a-nativetm-1/), [example-2](https://app.memrise.com/course/2021573/french-1/3/))
3. Simply **click the extension icon** ![CourseDump2022 icon](https://user-images.githubusercontent.com/93875472/197039734-bd2efdf8-a6c6-4327-8617-f2d3a95fcb3a.png) on the toolbar
    <br>(if you skipped the last installation step, click the `Extensions` button ![Chrome extension icon](https://user-images.githubusercontent.com/93875472/197036859-7c3ff1ab-a171-4408-8255-29ba6d8d8139.png) and then ![`CourseDump2022`](https://user-images.githubusercontent.com/93875472/197040206-6c5298bd-0f68-418d-9efb-a3ce1b8d275d.png))
 
After that you should see a progress bar at the top, indicating the progress of the extension scanning the course's page:

![image](https://user-images.githubusercontent.com/93875472/199846918-1ad6cfe1-0e8c-498b-8a14-e1c4ef6851ca.png)

When the scanning is complete, the bar will start to fill with yellow, as the extension sends the `.csv` file, course metadata, and media files (if you chose to download them) to *Google Chrome* download queue. The downloaded files should appear in your downloads directory, in a subfolder named with the course's name and id, as well as the name of the author.

### Batch download

1. Make a list of urls of the Memrise courses to download in the `queue.txt` file found in the extension folder (the examples of urls are provided in the file)
2. Set `BATCH = true` ([changing settings](https://github.com/Eltaurus-Lt/CourseDump2022#settings))
3. During batch download the option of downloading media is defined by `ALWAYS_DWLD_MEDIA` constant. So set `ALWAYS_DWLD_MEDIA = true` to download all media files or `ALWAYS_DWLD_MEDIA = false` to download none
4. Open any [Memrise](https://memrise.com/) page and make sure you are logged in
5. Click the extension icon ![CourseDump2022 icon](https://user-images.githubusercontent.com/93875472/197039734-bd2efdf8-a6c6-4327-8617-f2d3a95fcb3a.png) 

## Importing into Anki

### Simple import without media
1. In *Anki* click `File` and then `Import`
2. Navigate to the `.csv` file created after [step 3 of downloading a course](https://github.com/Eltaurus-Lt/CourseDump2022#downloading-a-memrise-course)
3. Adjust the import settings:
    1. Indicate the Note Type you want to use in the `Type` field (if you don't have any particular Note Type in mind, the `Basic` one will do)
    2. In the `Deck` field select the Deck you want cards to go into (you can create a new one from this menu by clicking a deck name after the `Deck`field and then `Add`)
    3. Check the `Field mapping`<p> 
  ![image](https://user-images.githubusercontent.com/93875472/198799349-feb5d729-c33a-41e7-aa24-3d1af37e2943.png)</p>
  By default, the last column in `.csv` is filled with tags. All the fields from `.csv` that you don't want to import into Anki can be left out by selecting `Change` -> `Ignore field`. 

After you click the `Import` button you should see a message indicating how many notes have been imported:<p>
  ![Anki Import message](https://user-images.githubusercontent.com/93875472/196944166-5fbbfec8-2415-46cd-919a-73330ca67dbb.png)</p>
You can compare this number against the total number of words in the Memrise course you've been downloading. You can also check out the imported notes after clicking `Close` by going to `Browse` and selecting your deck in the deck list on the left side ![Anki Browser Deck list](https://user-images.githubusercontent.com/93875472/196944394-95712a57-c13c-4bf2-bce3-574e55c02a1b.png)

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
        3. Press `Fields` then `Add` buttons, and type a name (e.g. _Audio_. Repeat the adding if you need the _Video_ field as well). <br><sub>You might want to clone the existing Note Type before adding fields though, so as to preserve the original. For that, before step b.: click Add -> select the Note Type from the list to clone -> `OK` -> enter a new name -> `OK` -> go to step b. and select the new Note Type.</sub>
    
    For additional information regarding the Note Types editing please refer to [this section of Anki manual](https://docs.ankiweb.net/templates/fields.html#basic-replacements). 
    
A typical `Field mapping` for importing with media looks like this:
![image](https://user-images.githubusercontent.com/93875472/200242551-5b2d4613-6cdd-4588-b472-ed24d3aac25e.png)
    

## Settings

If you want the extension to download media by default without asking every time:
1. Open `cousedump2022.js` in any text editor 
2. Set `const ALWAYS_DWLD_MEDIA = true;` in the first line and save the file

The other available settings that can be changed in the same way:

| option           | description                                                                        |
| ---------------- | ---------------------------------------------------------------------------------- |
| ANKI_HELP_PROMPT | Setting to `false` disables the popup which links to this page after the download  |
| BATCH            | Setting to `true` enables [batch download](https://github.com/Eltaurus-Lt/CourseDump2022#batch-download) of Memrise courses |
| LEVEL_TAGS       | Setting to `false` removes column with hierarchical course::level tags from `.csv` |
| EXTRA_INFO       | Setting to `true` makes the extension to download additional word data if present |
| COLLAPSE_COLUMNS | Setting to `false` leaves empty columns in the `.csv` tables, so that the numbering of fields ([step 3.iii.](https://github.com/Eltaurus-Lt/CourseDump2022#simple-import-without-media)) is the same for any course: 1 - _Learned word_, 2 - _Definition_, 3 - _Audio_, 4 - _Video_, 5 - _Tags_, 6 - _Extra_. |


## Known issues

There is a problem with encoding of a small subset of Unicode characters, which results in media filenames being written with _ where their entries in `.csv` tables are written with %. If you encounter such a case, the workaround is to replace all % in `.csv` file with _ in any text editor before importing it into Anki:

![image](https://user-images.githubusercontent.com/93875472/197361505-70f2d10f-728b-4412-adc0-a19cd30aef04.png)

## Discussion
If you encounter errors, have further questions regarding the extension, or need any help with using the downloaded materials in Anki, please leave a comment in this thread: [Memrise2Anki Replacement](https://community.memrise.com/t/memrise2anki-replacement/77107)
